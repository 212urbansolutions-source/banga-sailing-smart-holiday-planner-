const NAUSYS_BASE_URL = "https://ws.nausys.com/CBMS-external/rest";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=82";

const YACHT_CATEGORY_BY_TYPE = {
  catamaran: [51],
  sailing: [1],
  motor: [101],
};

module.exports = async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(204).end();
  }

  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const username = process.env.NAUSYS_USERNAME;
  const password = process.env.NAUSYS_PASSWORD;

  if (!username || !password) {
    return response.status(500).json({
      error: "Missing NAUSYS_USERNAME or NAUSYS_PASSWORD in Vercel Environment Variables.",
      fallback: true,
    });
  }

  try {
    const body =
      typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};
    const search = buildNausysSearch(body, username, password);
    const nausysResponse = await fetch(`${NAUSYS_BASE_URL}/yachtReservation/v6/freeYachtsSearch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(search),
    });

    const data = await nausysResponse.json();

    if (!nausysResponse.ok || data.status !== "OK") {
      return response.status(nausysResponse.status || 502).json({
        error: data.message || data.error || "NAUSYS search request failed.",
        status: data.status,
        errorCode: data.errorCode,
        raw: process.env.NAUSYS_DEBUG === "true" ? data : undefined,
      });
    }

    const boats = (data.freeYachtsInPeriod || []).map((item) =>
      normalizeFreeYacht(item, body.finderRegion || "all", body.finderType || "all"),
    );

    return response.status(200).json({
      source: "nausys",
      status: data.status,
      totalCount: data.totalCount || boats.length,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || search.resultsPage,
      periodFrom: data.from || search.periodFrom,
      periodTo: data.to || search.periodTo,
      boats,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message || "Could not connect to NAUSYS.",
    });
  }
};

function buildNausysSearch(body, username, password) {
  const dateRange = resolveDateRange(body.finderDate);
  const request = {
    credentials: { username, password },
    periodFrom: dateRange.from,
    periodTo: dateRange.to,
    resultsPerPage: Number(process.env.NAUSYS_RESULTS_PER_PAGE || body.resultsPerPage || 12),
    resultsPage: Number(body.resultsPage || 1),
    currency: "EUR",
    orderby: body.sort === "price" ? 2 : 5,
    desc: body.sort === "year" ? 1 : 0,
    extendedDataSet: "PAYMENT_PLAN",
  };

  const regionIds = regionIdsFor(body.finderRegion);
  if (regionIds.length) {
    request.regions = regionIds;
  }

  const categoryIds = YACHT_CATEGORY_BY_TYPE[body.finderType];
  if (categoryIds) {
    request.yachtCategories = categoryIds;
  }

  const priceTo = Number(body.maxPrice);
  if (priceTo) {
    request.priceTo = priceTo;
  }

  const cabins = Number(body.finderCabins || body.minCabins);
  if (cabins) {
    request.cabins = [cabins];
  }

  return request;
}

function resolveDateRange(value) {
  const start = value ? new Date(`${value}T12:00:00Z`) : nextSaturday();
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 7);

  return {
    from: formatNausysDate(start),
    to: formatNausysDate(end),
  };
}

function nextSaturday() {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  const day = date.getUTCDay();
  const daysUntilSaturday = (6 - day + 7) % 7 || 7;
  date.setUTCDate(date.getUTCDate() + daysUntilSaturday);
  return date;
}

function formatNausysDate(date) {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getUTCFullYear()}`;
}

function regionIdsFor(region) {
  try {
    const configured = JSON.parse(process.env.NAUSYS_REGION_IDS_BY_KEY || "{}");
    const ids = configured[region];
    return Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function normalizeFreeYacht(item, selectedRegion, selectedType) {
  const details = item.yacht || item.restYacht || item.details || {};
  const price = item.price || {};
  const yachtId = item.yachtId || details.id;
  const cabins = numberOrFallback(details.cabins, details.cabinsTotal, 0);
  const berths = numberOrFallback(details.berthsTotal, details.berthsCabin, 0);
  const year = numberOrFallback(details.buildYear, details.year, "");
  const length = details.loa ? `${details.loa} m` : details.length ? `${details.length} m` : "";

  return {
    id: `nausys-${yachtId || Math.random().toString(36).slice(2)}`,
    nausysYachtId: yachtId,
    name: details.name || item.yachtName || `NAUSYS yacht ${yachtId || ""}`.trim(),
    type: inferBoatType(details, selectedType),
    region: selectedRegion === "all" ? "nausys-live" : selectedRegion,
    base: details.baseName || details.locationName || `Base ID ${item.locationFromId || details.baseId || ""}`.trim(),
    price: Number(price.clientPrice || price.priceListPrice || item.clientPrice || item.price || 0),
    listPrice: Number(price.priceListPrice || 0),
    currency: price.currency || item.currency || "EUR",
    rating: Number(details.euminia?.total || 4.6),
    year,
    cabins,
    berths,
    length,
    skipper: true,
    ac: hasEquipment(details, ["air condition", "a/c", "generator"]),
    waterToys: hasEquipment(details, ["sup", "snork", "water toy", "dinghy"]),
    badge: "NAUSYS live",
    image: cleanImageUrl(details.mainPictureUrl) || pictureFromList(details) || imageFromId(yachtId),
    fallbackImage: FALLBACK_IMAGE,
    note: `Available ${item.periodFrom || ""} to ${item.periodTo || ""}. Real NAUSYS ID ${yachtId || "pending"}.`,
    source: "nausys",
  };
}

function inferBoatType(details, fallbackType) {
  const text = `${details.categoryName || ""} ${details.yachtCategoryName || ""} ${details.modelName || ""}`.toLowerCase();
  if (text.includes("catamaran")) return "catamaran";
  if (text.includes("motor")) return "motor";
  if (text.includes("power")) return "powerboat";
  if (fallbackType && fallbackType !== "all") return fallbackType;
  return "sailing";
}

function cleanImageUrl(value) {
  if (!value || typeof value !== "string") return "";
  const match = value.match(/https?:\/\/\S+/);
  return match ? `${match[0].replace(/[",]+$/, "")}?w=900` : "";
}

function pictureFromList(details) {
  const pictures = Array.isArray(details.pictures) ? details.pictures : [];
  const picture = pictures.find((item) => item.mainPicture || item.src) || pictures[0];
  return cleanImageUrl(picture?.src);
}

function imageFromId(yachtId) {
  return yachtId ? `${NAUSYS_BASE_URL}/yacht/${yachtId}/pictures/main.jpg?w=900` : FALLBACK_IMAGE;
}

function hasEquipment(details, needles) {
  const equipment = [
    ...(details.standardYachtEquipment || []),
    ...(details.additionalYachtEquipment || []),
  ];
  const text = JSON.stringify(equipment).toLowerCase();
  return needles.some((needle) => text.includes(needle));
}

function numberOrFallback(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) {
      return number;
    }
  }
  return values[values.length - 1];
}
