const NAUSYS_BASE_URL = "https://ws.nausys.com/CBMS-external/rest";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=82";

module.exports = async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(204).end();
  }

  const username = process.env.NAUSYS_USERNAME;
  const password = process.env.NAUSYS_PASSWORD;

  if (!username || !password) {
    return response.status(500).json({
      error: "Missing NAUSYS_USERNAME or NAUSYS_PASSWORD in Vercel Environment Variables.",
    });
  }

  const body =
    typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};
  const yachtId = request.query?.id || body.id || body.yachtId;

  if (!yachtId) {
    return response.status(400).json({ error: "Missing NAUSYS yacht id." });
  }

  try {
    const nausysResponse = await fetch(`${NAUSYS_BASE_URL}/catalogue/v6/yacht/${yachtId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await nausysResponse.json();

    if (!nausysResponse.ok || data.status !== "OK") {
      return response.status(nausysResponse.status || 502).json({
        error: data.message || data.error || "NAUSYS yacht detail request failed.",
        status: data.status,
        errorCode: data.errorCode,
        raw: process.env.NAUSYS_DEBUG === "true" ? data : undefined,
      });
    }

    const yacht = Array.isArray(data.yachts) ? data.yachts[0] : data.yacht || null;

    if (!yacht) {
      return response.status(404).json({ error: "Yacht was not found in NAUSYS." });
    }

    return response.status(200).json({
      source: "nausys",
      status: data.status,
      yacht: normalizeYacht(yacht),
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message || "Could not connect to NAUSYS yacht detail API.",
    });
  }
};

function normalizeYacht(yacht) {
  const yachtId = yacht.id;
  const pictures = normalizePictures(yacht, yachtId);

  return {
    id: yachtId,
    name: cleanName(yacht.name) || `NAUSYS yacht ${yachtId}`,
    modelId: yacht.yachtModelId || "",
    companyId: yacht.companyId || "",
    baseId: yacht.baseId || "",
    locationId: yacht.locationId || "",
    type: inferBoatType(yacht),
    cabins: yacht.cabins || 0,
    cabinsCrew: yacht.cabinsCrew || 0,
    berthsCabin: yacht.berthsCabin || 0,
    berthsSalon: yacht.berthsSalon || 0,
    berthsCrew: yacht.berthsCrew || 0,
    berthsTotal: yacht.berthsTotal || 0,
    wc: yacht.wc || 0,
    wcCrew: yacht.wcCrew || 0,
    buildYear: yacht.buildYear || yacht.year || "",
    loa: yacht.loa || yacht.length || "",
    draft: yacht.draft || "",
    engines: yacht.engines || "",
    enginePower: yacht.enginePower || "",
    rating: Number(yacht.euminia?.total || 4.6),
    reviews: yacht.euminia?.reviews || "",
    deposit: yacht.deposit || "",
    commission: yacht.commission || "",
    mainPictureUrl: pictures[0] || imageFromId(yachtId),
    pictures,
    standardEquipmentCount: Array.isArray(yacht.standardYachtEquipment)
      ? yacht.standardYachtEquipment.length
      : 0,
    equipmentHighlights: equipmentHighlights(yacht),
    rawAvailable: process.env.NAUSYS_DEBUG === "true",
  };
}

function normalizePictures(yacht, yachtId) {
  const urls = [];
  addPicture(urls, yacht.mainPictureUrl);

  for (const item of yacht.picturesURL || []) {
    addPicture(urls, item);
  }

  for (const item of yacht.pictures || []) {
    addPicture(urls, item?.src);
  }

  if (!urls.length && yachtId) {
    urls.push(imageFromId(yachtId));
  }

  return [...new Set(urls)].slice(0, 8);
}

function addPicture(urls, value) {
  const url = cleanImageUrl(value);
  if (url) {
    urls.push(url);
  }
}

function cleanImageUrl(value) {
  if (!value || typeof value !== "string") return "";
  const match = value.match(/https?:\/\/\S+/);
  return match ? `${match[0].replace(/[",]+$/, "")}?w=1200` : "";
}

function imageFromId(yachtId) {
  return yachtId ? `${NAUSYS_BASE_URL}/yacht/${yachtId}/pictures/main.jpg?w=1200` : FALLBACK_IMAGE;
}

function cleanName(value) {
  if (!value || typeof value !== "string") return "";
  return value.replace(/^["\s,]+|["\s,]+$/g, "").trim();
}

function inferBoatType(yacht) {
  const text = `${yacht.categoryName || ""} ${yacht.yachtCategoryName || ""} ${yacht.modelName || ""}`.toLowerCase();
  if (text.includes("catamaran")) return "Catamaran";
  if (text.includes("motor")) return "Motor yacht";
  if (text.includes("power")) return "Powerboat";
  return "Sailing yacht";
}

function equipmentHighlights(yacht) {
  const equipment = [
    ...(yacht.standardYachtEquipment || []),
    ...(yacht.additionalYachtEquipment || []),
  ];
  const text = JSON.stringify(equipment).toLowerCase();
  const highlights = [];

  if (text.includes("air") || text.includes("a/c")) highlights.push("Air conditioning");
  if (text.includes("generator")) highlights.push("Generator");
  if (text.includes("dinghy")) highlights.push("Dinghy");
  if (text.includes("sup")) highlights.push("SUP");
  if (text.includes("bow")) highlights.push("Bow thruster");

  return highlights.length ? highlights : ["Inventory details from NAUSYS", "Equipment list available by API"];
}
