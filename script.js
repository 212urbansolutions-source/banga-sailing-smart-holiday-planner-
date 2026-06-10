const routeForm = document.querySelector("#routeForm");
const routeOutput = document.querySelector("#routeOutput");
const regionSelect = document.querySelector("#regionSelect");
const startSelect = document.querySelector("#startSelect");
const boatFinderForm = document.querySelector("#boatFinderForm");
const boatResults = document.querySelector("#boatResults");
const boatResultCount = document.querySelector("#boatResultCount");
const priceFilter = document.querySelector("#priceFilter");
const priceOutput = document.querySelector("#priceOutput");
const skipperFilter = document.querySelector("#skipperFilter");
const acFilter = document.querySelector("#acFilter");
const waterToysFilter = document.querySelector("#waterToysFilter");
const cabinsFilter = document.querySelector("#cabinsFilter");
const sortBoats = document.querySelector("#sortBoats");
const mobileSortBoats = document.querySelector("#mobileSortBoats");
const openFilters = document.querySelector("#openFilters");
const closeFilters = document.querySelector("#closeFilters");

let activeBoatInventory = [];
let boatInventorySource = "demo";

const routeData = {
  "croatia-dalmatia": {
    wind: "12-18 kn",
    marinas: "5 marinas",
    line: "Split to Dubrovnik",
    kids: "adds short legs and safe swim stops",
    culture: "adds Korcula old town",
  },
  "greece-ionian": {
    wind: "8-16 kn",
    marinas: "4 harbors",
    line: "Corfu or Lefkas to Paxos",
    kids: "adds short legs and sheltered beaches",
    culture: "adds Corfu old town",
  },
  "greece-saronic": {
    wind: "8-18 kn",
    marinas: "5 ports",
    line: "Athens to Hydra",
    kids: "adds calm stops near Poros and Aegina",
    culture: "adds Aegina and Hydra",
  },
  "greece-cyclades": {
    wind: "12-24 kn",
    marinas: "6 island stops",
    line: "Athens to Serifos",
    kids: "adds short crossings and beach time",
    culture: "adds Syros and Paros",
  },
  "turkey-lycian": {
    wind: "6-16 kn",
    marinas: "5 bays",
    line: "Gocek to Fethiye",
    kids: "adds easy bays and family lunch stops",
    culture: "adds Kaunos and Lycian ruins",
  },
  "italy-amalfi": {
    wind: "6-14 kn",
    marinas: "5 ports",
    line: "Naples to Amalfi",
    kids: "adds shorter hops and beach clubs",
    culture: "adds Pompeii day stop",
  },
  bvi: {
    wind: "14-20 kn",
    marinas: "6 moorings",
    line: "Tortola loop",
    kids: "adds easy moorings and beach days",
    culture: "adds local beach bars",
  },
};

const startPoints = {
  "croatia-dalmatia": ["Split", "Dubrovnik", "Trogir", "Sibenik", "Zadar"],
  "greece-ionian": ["Corfu", "Lefkas", "Preveza", "Paxos"],
  "greece-saronic": ["Athens", "Lavrion", "Poros", "Aegina"],
  "greece-cyclades": ["Athens", "Lavrion", "Paros", "Mykonos"],
  "turkey-lycian": ["Gocek", "Fethiye", "Marmaris", "Bodrum"],
  "italy-amalfi": ["Naples", "Salerno", "Procida", "Capri"],
  bvi: ["Tortola", "Nanny Cay", "Road Town", "Virgin Gorda"],
};

const boatInventory = [
  {
    id: "cat-ionian-42",
    name: "Lagoon 42 Holiday",
    type: "catamaran",
    region: "greece-ionian",
    base: "Lefkas",
    price: 6900,
    rating: 4.8,
    year: 2022,
    cabins: 4,
    berths: 8,
    length: "12.8 m",
    skipper: true,
    ac: true,
    waterToys: true,
    badge: "Family favorite",
    image: "https://cloud.yatco.com/ForSale/Vessel/Photo/443725/small_4607406.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=82",
    note: "Stable catamaran for Ionian swim stops, Paxos bays, and relaxed island dinners.",
  },
  {
    id: "mono-saronic-45",
    name: "Oceanis 45 Saronic",
    type: "sailing",
    region: "greece-saronic",
    base: "Athens",
    price: 4300,
    rating: 4.6,
    year: 2020,
    cabins: 4,
    berths: 8,
    length: "13.9 m",
    skipper: true,
    ac: false,
    waterToys: false,
    badge: "Best value",
    image: "https://www.beneteau.com/sites/default/files/styles/standard_large/public/oceanis45_0076formatok.jpg.webp?itok=lYno3Zn2",
    fallbackImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=82",
    note: "Classic sailing yacht for Hydra, Poros, Aegina, and sheltered Saronic passages.",
  },
  {
    id: "cat-croatia-46",
    name: "Bali 4.6 Dalmatia",
    type: "catamaran",
    region: "croatia-dalmatia",
    base: "Split",
    price: 8200,
    rating: 4.9,
    year: 2023,
    cabins: 5,
    berths: 10,
    length: "14.3 m",
    skipper: true,
    ac: true,
    waterToys: true,
    badge: "New season",
    image: "https://www.bali-catamarans.com/_next/image?q=75&url=https%3A%2F%2Fbrave-car-d225abcbfb.media.strapiapp.com%2FEN_Cover_4_6_70994bf2f8.png&w=1920",
    fallbackImage: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=900&q=82",
    note: "Wide living space for Hvar, Vis, Korcula, wine stops, and blue-water swims.",
  },
  {
    id: "motor-turkey-52",
    name: "Azimut 52 Gocek",
    type: "motor",
    region: "turkey-lycian",
    base: "Gocek",
    price: 11800,
    rating: 4.7,
    year: 2021,
    cabins: 3,
    berths: 6,
    length: "16.1 m",
    skipper: true,
    ac: true,
    waterToys: true,
    badge: "Fast coastal hops",
    image: "https://www.devalk.nl/images/thumbnails/website/azimut-52-57229_2e.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=82",
    note: "Comfortable motor yacht for Gocek islands, Fethiye, beach clubs, and short passages.",
  },
  {
    id: "power-amalfi-34",
    name: "Itama 38 Capri Day",
    type: "powerboat",
    region: "italy-amalfi",
    base: "Naples",
    price: 3600,
    rating: 4.5,
    year: 2019,
    cabins: 1,
    berths: 2,
    length: "11.6 m",
    skipper: true,
    ac: false,
    waterToys: true,
    badge: "Day charter",
    image: "https://frg-fwm.azurewebsites.net/asset/fwm/Upload/Models/Images/PhotoGallery/Itama/Webp/95242.webp",
    fallbackImage: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=82",
    note: "Powerboat for Capri, Positano, swim stops, and lunch reservations ashore.",
  },
  {
    id: "cat-cyclades-40",
    name: "Fountaine Pajot FP41",
    type: "catamaran",
    region: "greece-cyclades",
    base: "Lavrion",
    price: 7400,
    rating: 4.7,
    year: 2021,
    cabins: 4,
    berths: 8,
    length: "12.1 m",
    skipper: true,
    ac: true,
    waterToys: false,
    badge: "Cyclades ready",
    image: "https://www.catamarans-fountaine-pajot.com/wp-content/uploads/sites/3/2025/06/Template-photo-header-SC-FP41-min-scaled.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=82",
    note: "Compact catamaran for Kythnos, Serifos, Syros, and flexible wind-aware routing.",
  },
];

activeBoatInventory = boatInventory;

function updateStartPoints() {
  const points = startPoints[regionSelect.value] || [];
  startSelect.innerHTML = points.map((point) => `<option value="${point}">${point}</option>`).join("");
}

if (regionSelect && startSelect) {
  regionSelect.addEventListener("change", updateStartPoints);
  updateStartPoints();
}

if (boatFinderForm) {
  boatFinderForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await loadNausysBoatResults();
  });

  [priceFilter, skipperFilter, acFilter, waterToysFilter, cabinsFilter, sortBoats, mobileSortBoats].forEach((control) => {
    if (!control) {
      return;
    }
    control.addEventListener("input", renderBoatResults);
    control.addEventListener("change", renderBoatResults);
  });

  openFilters?.addEventListener("click", () => {
    document.body.classList.add("filters-open");
  });

  closeFilters?.addEventListener("click", () => {
    document.body.classList.remove("filters-open");
  });

  mobileSortBoats?.addEventListener("change", () => {
    if (sortBoats) {
      sortBoats.value = mobileSortBoats.value;
    }
  });

  sortBoats?.addEventListener("change", () => {
    if (mobileSortBoats) {
      mobileSortBoats.value = sortBoats.value;
    }
  });

  renderBoatResults();
}

async function loadNausysBoatResults() {
  if (!boatFinderForm || !boatResults || !boatResultCount) {
    return;
  }

  const formData = new FormData(boatFinderForm);
  const maxPrice = Number(priceFilter?.value) || 16000;
  const minCabins = Math.max(Number(formData.get("finderCabins")) || 0, Number(cabinsFilter?.value) || 0);
  const sort = sortBoats?.value || mobileSortBoats?.value || "recommended";

  boatResultCount.textContent = "Searching NAUSYS live inventory...";
  boatResults.innerHTML = `
    <div class="boat-empty">
      Connecting to NAUSYS and checking real charter availability.
    </div>
  `;

  try {
    const response = await fetch("/api/nausys-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        finderRegion: formData.get("finderRegion"),
        finderDate: formData.get("finderDate"),
        finderCabins: formData.get("finderCabins"),
        finderType: formData.get("finderType"),
        maxPrice,
        minCabins,
        sort,
      }),
    });

    const data = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(data.error || "NAUSYS live search is not available yet.");
    }

    activeBoatInventory = Array.isArray(data.boats) ? data.boats : [];
    boatInventorySource = "nausys";
    renderBoatResults({
      sourceLabel: `NAUSYS live: ${data.totalCount || 0} available`,
      notice:
        Array.isArray(data.boats) && data.boats.length
          ? ""
          : "NAUSYS returned no live yachts for this exact search. Try a different date, wider budget, or fewer filters.",
    });
  } catch (error) {
    activeBoatInventory = boatInventory;
    boatInventorySource = "demo";
    renderBoatResults({
      notice: `${cleanApiError(error.message)} Showing demo boats until NAUSYS credentials/API access are configured.`,
    });
  }
}

async function readJsonResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      error: response.ok ? "NAUSYS response was not valid JSON." : "NAUSYS live search is not available yet.",
    };
  }
}

function cleanApiError(message) {
  if (!message || message.includes("Unexpected token") || message.includes("Not found")) {
    return "NAUSYS live search is not available yet.";
  }

  return message;
}

function renderBoatResults(options = {}) {
  if (!boatFinderForm || !boatResults || !boatResultCount) {
    return;
  }

  const formData = new FormData(boatFinderForm);
  const region = formData.get("finderRegion");
  const type = formData.get("finderType");
  const maxPrice = Number(priceFilter?.value) || 16000;
  const minCabins = Math.max(Number(formData.get("finderCabins")) || 0, Number(cabinsFilter?.value) || 0);
  const sort = sortBoats?.value || mobileSortBoats?.value || "recommended";

  if (priceOutput) {
    priceOutput.textContent = `Up to EUR ${maxPrice.toLocaleString("en-US")}`;
  }

  let results = activeBoatInventory.filter((boat) => {
    const matchesRegion = region === "all" || boat.region === region;
    const matchesType = type === "all" || boat.type === type;
    const matchesPrice = boat.price <= maxPrice;
    const matchesCabins = !minCabins || boat.cabins >= minCabins || (boat.source === "nausys" && !boat.cabins);
    const matchesSkipper = !skipperFilter?.checked || boat.skipper;
    const matchesAc = !acFilter?.checked || boat.ac;
    const matchesWaterToys = !waterToysFilter?.checked || boat.waterToys;

    return (
      matchesRegion &&
      matchesType &&
      matchesPrice &&
      matchesCabins &&
      matchesSkipper &&
      matchesAc &&
      matchesWaterToys
    );
  });

  results = sortBoatResults(results, sort);
  const sourceLabel =
    options.sourceLabel || (boatInventorySource === "nausys" ? "NAUSYS live" : "Demo inventory");
  boatResultCount.textContent = `${results.length} ${results.length === 1 ? "boat" : "boats"} found | ${sourceLabel}`;

  if (!results.length) {
    boatResults.innerHTML = `
      <div class="boat-empty">
        ${escapeHtml(options.notice || "No boats match these filters yet. Try wider dates, destination, budget, or boat type.")}
      </div>
    `;
    return;
  }

  const notice = options.notice
    ? `<div class="boat-empty">${escapeHtml(options.notice)}</div>`
    : "";
  boatResults.innerHTML = `${notice}${results.map(renderBoatCard).join("")}`;
}

function sortBoatResults(results, sort) {
  const sorted = [...results];

  if (sort === "price") {
    return sorted.sort((a, b) => a.price - b.price);
  }

  if (sort === "rating") {
    return sorted.sort((a, b) => b.rating - a.rating);
  }

  if (sort === "year") {
    return sorted.sort((a, b) => b.year - a.year);
  }

  return sorted.sort((a, b) => b.rating * 100 - b.price / 100 - (a.rating * 100 - a.price / 100));
}

function renderBoatCard(boat) {
  const includes = [
    boat.skipper ? "Skipper" : "Bareboat option",
    boat.ac ? "A/C" : "Natural ventilation",
    boat.waterToys ? "Water toys" : "Swim ladder",
  ];
  const detailUrl = buildBoatDetailUrl(boat);

  return `
    <article class="boat-card" data-boat-id="${boat.id}">
      <a class="boat-card-image-link" href="${escapeHtml(detailUrl)}" aria-label="Open ${escapeHtml(boat.name)} boat page">
        <img
          src="${escapeHtml(boat.image)}"
          alt="${escapeHtml(boat.name)} charter boat"
          onerror="this.onerror=null;this.src='${escapeHtml(boat.fallbackImage || boat.image)}';"
        />
      </a>
      <div class="boat-card-body">
        <div class="boat-card-top">
          <div>
            <span class="boat-badge">${escapeHtml(boat.badge)}</span>
            <h3><a href="${escapeHtml(detailUrl)}">${escapeHtml(boat.name)}</a></h3>
            <div class="boat-location">${escapeHtml(boat.base)} | ${formatRegionName(boat.region)} | Rating ${boat.rating}</div>
          </div>
          <div class="boat-price">
            <strong>${formatBoatPrice(boat)}</strong>
            <span>per week from</span>
          </div>
        </div>
        <ul class="boat-specs">
          <li>${escapeHtml(formatBoatType(boat.type))}</li>
          <li>${boat.cabins || "?"} cabins</li>
          <li>${boat.berths || "?"} guests</li>
          <li>${escapeHtml(boat.length || "Length on request")}</li>
          <li>${boat.year || "Year on request"}</li>
        </ul>
        <p>${escapeHtml(boat.note)}</p>
        <ul class="boat-includes">
          ${includes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
        <div class="boat-card-actions">
          <small>${boat.source === "nausys" ? `Live NAUSYS record ${escapeHtml(String(boat.nausysYachtId || ""))}` : "API-ready card: replace mock data with broker availability later."}</small>
          <a class="button light" href="${escapeHtml(detailUrl)}">Open boat page</a>
        </div>
      </div>
    </article>
  `;
}

function buildBoatDetailUrl(boat) {
  const params = new URLSearchParams();
  params.set("id", boat.nausysYachtId || boat.id);
  params.set("source", boat.source || "demo");

  if (boat.periodFrom) params.set("dateFrom", boat.periodFrom);
  if (boat.periodTo) params.set("dateTo", boat.periodTo);
  if (boat.price) params.set("price", String(boat.price));
  if (boat.listPrice) params.set("listPrice", String(boat.listPrice));
  if (boat.currency) params.set("currency", boat.currency);

  return `boat.html?${params.toString()}`;
}

function formatRegionName(region) {
  const names = {
    "croatia-dalmatia": "Croatia, Dalmatia",
    "greece-ionian": "Greece, Ionian",
    "greece-saronic": "Greece, Saronic",
    "greece-cyclades": "Greece, Cyclades",
    "turkey-lycian": "Turkey, Lycian Coast",
    "italy-amalfi": "Italy, Amalfi",
    "nausys-live": "NAUSYS live inventory",
    bvi: "British Virgin Islands",
  };

  return names[region] || region;
}

function formatBoatPrice(boat) {
  const currency = boat.currency || "EUR";
  const price = Number(boat.price);
  return price ? `${currency} ${price.toLocaleString("en-US")}` : "Price on request";
}

function formatBoatType(type) {
  const names = {
    catamaran: "Catamaran",
    sailing: "Sailing yacht",
    motor: "Motor yacht",
    powerboat: "Powerboat",
  };

  return names[type] || type;
}

const vesselData = {
  sailing: {
    label: "Sailing route",
    detail: "uses sail-friendly legs and sheltered alternates",
  },
  powerboat: {
    label: "Powerboat plan",
    detail: "adds fuel stops and faster coastal hops",
  },
  mixed: {
    label: "Mixed options",
    detail: "compares sailing comfort with powerboat speed",
  },
};

routeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(routeForm);
  const region = formData.get("region");
  const start = formData.get("start");
  const guests = formData.get("guests");
  const days = formData.get("days");
  const mood = formData.get("mood");
  const vessel = formData.get("vessel");
  const route = routeData[region];
  const vesselPlan = vesselData[vessel];
  const focus = mood === "balanced" ? "balanced route" : route[mood];

  routeOutput.innerHTML = `
    <div class="route-loading">
      <span class="metric">Planning...</span>
      <small>Creating an AI route preview</small>
    </div>
  `;

  generateAiPreview({ region, start, guests, days, mood, vessel })
    .then((result) => {
      routeOutput.innerHTML = `
        <div class="ai-preview">
          <span class="metric">AI preview</span>
          ${renderRouteMap(result.stops, start, region)}
          <p>${formatPreview(result.preview)}</p>
        </div>
      `;
      initializeRouteMap(result.stops, start, region);
    })
    .catch((error) => {
      routeOutput.innerHTML = `
        <div class="ai-preview route-error">
          <span class="metric">AI preview unavailable</span>
          <p>${formatPreview(error.message)}</p>
          <small>Check the Vercel function and OPENAI_API_KEY setup.</small>
        </div>
      `;
    });
});

async function generateAiPreview(routeRequest) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 40000);

  const response = await fetch("/api/generate-route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: controller.signal,
    body: JSON.stringify(routeRequest),
  }).catch((error) => {
    if (error.name === "AbortError") {
      throw new Error("Route generation took too long. Please try again, or choose fewer days.");
    }
    throw error;
  });

  window.clearTimeout(timeout);

  const text = await response.text();
  let result;

  try {
    result = JSON.parse(text);
  } catch {
    if (response.status === 404) {
      throw new Error(
        "Vercel cannot find /api/generate-route. Make sure api/generate-route.js is uploaded inside the api folder at GitHub root, then redeploy.",
      );
    }
    throw new Error(`API did not return JSON. Status ${response.status}.`);
  }

  if (!response.ok) {
    throw new Error(result.error || "Could not generate route preview.");
  }

  return {
    preview: result.preview,
    stops: Array.isArray(result.stops) ? result.stops : [],
  };
}

function formatPreview(preview) {
  return preview
    .replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return entities[character];
    })
    .replace(/\n/g, "<br>");
}

function renderRouteMap(stops, start, region) {
  const routeStops = normalizeStops(stops, start, region);

  return `
    <div class="real-route-map" aria-label="Generated route map">
      <div class="leaflet-route-map" id="generatedRouteMap"></div>
      <ol class="mini-route-stops">
        ${routeStops
          .map(
            (stop, index) => `
              <li>
                <strong>${index + 1}. ${escapeHtml(stop.name)}</strong>
                <span>${escapeHtml(stop.note || stop.type || "Route stop")}</span>
              </li>
            `,
          )
          .join("")}
      </ol>
    </div>
  `;
}

function initializeRouteMap(stops, start, region) {
  const routeStops = normalizeStops(stops, start, region);
  const mapElement = document.querySelector("#generatedRouteMap");

  if (!mapElement) {
    return;
  }

  if (!window.L) {
    mapElement.classList.add("painted-route-map");
    mapElement.innerHTML = renderPaintedChart(routeStops);
    return;
  }

  if (mapElement._leaflet_id) {
    mapElement._leaflet_id = null;
  }

  const map = L.map(mapElement, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const latLngs = routeStops.map((stop) => [stop.lat, stop.lng]);

  L.polyline(latLngs, {
    color: "#f6c400",
    weight: 4,
    opacity: 0.95,
    dashArray: "8 8",
  }).addTo(map);

  routeStops.forEach((stop, index) => {
    const marker = L.marker([stop.lat, stop.lng], {
      title: stop.name,
    }).addTo(map);

    marker.bindPopup(`<strong>${escapeHtml(stop.name)}</strong><br>${escapeHtml(stop.note || stop.type || "")}`);

    L.circleMarker([stop.lat, stop.lng], {
      radius: index === 0 ? 9 : 7,
      color: "#ffffff",
      weight: 2,
      fillColor: "#f6c400",
      fillOpacity: 1,
    })
      .addTo(map)
      .bindTooltip(String(index + 1), {
        permanent: true,
        direction: "center",
        className: "route-number-tooltip",
      });
  });

  map.fitBounds(latLngs, { padding: [30, 30] });
}

function renderPaintedChart(routeStops) {
  const points = routeStops.map((stop, index) => {
    const progress = routeStops.length === 1 ? 0 : index / (routeStops.length - 1);
    return {
      ...stop,
      x: 10 + progress * 80,
      y: 52 - Math.sin(progress * Math.PI) * 24 + (index % 2 === 0 ? 2 : 10),
    };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");

  return `
    <svg viewBox="0 0 100 72" role="img" aria-label="Painted nautical route map">
      <defs>
        <linearGradient id="paintedWater" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#bff7f6" />
          <stop offset="0.55" stop-color="#2bc7d2" />
          <stop offset="1" stop-color="#047e91" />
        </linearGradient>
      </defs>
      <rect width="100" height="72" fill="url(#paintedWater)" />
      <path class="chart-land" d="M66 7 C78 1 92 4 100 13 L100 72 L76 72 C73 58 83 50 76 39 C70 30 62 23 66 7Z" />
      <path class="chart-land" d="M0 0 L23 0 C20 11 29 18 22 27 C15 36 4 32 0 42Z" />
      <path class="chart-island" d="M33 48 C39 42 48 45 50 52 C44 58 36 58 33 48Z" />
      <path class="chart-island" d="M53 26 C58 22 65 25 66 31 C60 35 55 33 53 26Z" />
      <path class="chart-contour" d="M5 58 C18 49 27 65 42 56 S64 45 82 55" />
      <path class="chart-route" d="${path}" />
      ${points
        .map(
          (point, index) => `
            <g>
              <circle class="chart-stop" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${index === 0 ? 3.7 : 3}" />
              <text class="chart-stop-number" x="${point.x.toFixed(1)}" y="${(point.y + 1.3).toFixed(1)}">${index + 1}</text>
              <text class="chart-label" x="${Math.min(86, point.x + 3).toFixed(1)}" y="${Math.max(8, point.y - 4).toFixed(1)}">${escapeHtml(point.name).slice(0, 13)}</text>
            </g>
          `,
        )
        .join("")}
    </svg>
  `;
}

function normalizeStops(stops, start, region) {
  const fallback = fallbackStops(start, region);
  const cleanStops = stops
    .filter((stop) => stop && stop.name)
    .slice(0, 8)
    .map((stop, index) => ({
      name: String(stop.name),
      type: String(stop.type || ""),
      note: String(stop.note || ""),
      lat: Number(stop.lat) || fallback[index % fallback.length].lat,
      lng: Number(stop.lng) || fallback[index % fallback.length].lng,
    }));

  if (!cleanStops.length) {
    return fallback;
  }

  return cleanStops;
}

function fallbackStops(start, region) {
  const fallbackByRegion = {
    "greece-saronic": [
      { name: start, note: "Start marina", lat: 37.943, lng: 23.646 },
      { name: "Aegina", note: "Seafood and old town", lat: 37.746, lng: 23.428 },
      { name: "Poros", note: "Sheltered waterfront", lat: 37.499, lng: 23.454 },
      { name: "Hydra", note: "Car-free island evening", lat: 37.35, lng: 23.466 },
    ],
    "greece-ionian": [
      { name: start, note: "Start marina", lat: 39.624, lng: 19.922 },
      { name: "Paxos", note: "Blue bays", lat: 39.202, lng: 20.185 },
      { name: "Antipaxos", note: "Swim stop", lat: 39.151, lng: 20.228 },
      { name: "Lefkas", note: "Marina night", lat: 38.833, lng: 20.711 },
    ],
    "greece-cyclades": [
      { name: start, note: "Start marina", lat: 37.716, lng: 24.056 },
      { name: "Kythnos", note: "Kolona beach", lat: 37.39, lng: 24.43 },
      { name: "Serifos", note: "Chora dinner", lat: 37.153, lng: 24.506 },
      { name: "Syros", note: "Culture stop", lat: 37.444, lng: 24.942 },
    ],
    "turkey-lycian": [
      { name: start, note: "Start marina", lat: 36.754, lng: 28.941 },
      { name: "Gocek Islands", note: "Quiet coves", lat: 36.699, lng: 28.894 },
      { name: "Fethiye", note: "Harbor and market", lat: 36.659, lng: 29.126 },
      { name: "Gemiler", note: "Sunset anchorage", lat: 36.554, lng: 29.071 },
    ],
    "croatia-dalmatia": [
      { name: start, note: "Start marina", lat: 43.508, lng: 16.44 },
      { name: "Solta", note: "Swim stop", lat: 43.393, lng: 16.288 },
      { name: "Hvar", note: "Island evening", lat: 43.172, lng: 16.442 },
      { name: "Korcula", note: "Old town", lat: 42.961, lng: 17.136 },
    ],
    "italy-amalfi": [
      { name: start, note: "Start marina", lat: 40.851, lng: 14.268 },
      { name: "Procida", note: "Colorful harbor", lat: 40.757, lng: 14.014 },
      { name: "Capri", note: "Swim and lunch", lat: 40.553, lng: 14.222 },
      { name: "Amalfi", note: "Coast dinner", lat: 40.634, lng: 14.602 },
    ],
    bvi: [
      { name: start, note: "Start marina", lat: 18.428, lng: -64.618 },
      { name: "Norman Island", note: "Snorkeling", lat: 18.316, lng: -64.62 },
      { name: "Virgin Gorda", note: "The Baths", lat: 18.48, lng: -64.402 },
      { name: "Anegada", note: "Beach and lobster", lat: 18.731, lng: -64.323 },
    ],
  };

  return fallbackByRegion[region] || fallbackByRegion["greece-saronic"];
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

/*
Fallback preview for local static testing when /api/generate-route is not running.
*/
function renderFallbackPreview({ route, guests, days, focus, vesselPlan }) {
  routeOutput.innerHTML = `
    <div>
      <span class="metric">${route.wind}</span>
      <small>forecast planning window</small>
    </div>
    <div>
      <span class="metric">${route.marinas}</span>
      <small>for ${guests} guests</small>
    </div>
    <div>
      <span class="metric">${days} days</span>
      <small>${route.line}, ${focus}; ${vesselPlan.detail}</small>
    </div>
  `;
}
