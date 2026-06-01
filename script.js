const routeForm = document.querySelector("#routeForm");
const routeOutput = document.querySelector("#routeOutput");
const regionSelect = document.querySelector("#regionSelect");
const startSelect = document.querySelector("#startSelect");

const routeData = {
  "croatia-dalmatia": {
    wind: "12-18 kn",
    marinas: "5 marinas",
    line: "Split to Dubrovnik",
    quiet: "adds Solta and Lastovo",
    culture: "adds Korcula old town",
  },
  "greece-ionian": {
    wind: "8-16 kn",
    marinas: "4 harbors",
    line: "Corfu or Lefkas to Paxos",
    quiet: "adds Meganisi coves",
    culture: "adds Corfu old town",
  },
  "greece-saronic": {
    wind: "8-18 kn",
    marinas: "5 ports",
    line: "Athens to Hydra",
    quiet: "adds Poros anchorages",
    culture: "adds Aegina and Hydra",
  },
  "greece-cyclades": {
    wind: "12-24 kn",
    marinas: "6 island stops",
    line: "Athens to Serifos",
    quiet: "adds Kythnos bays",
    culture: "adds Syros and Paros",
  },
  "turkey-lycian": {
    wind: "6-16 kn",
    marinas: "5 bays",
    line: "Gocek to Fethiye",
    quiet: "adds Gemiler and Sarsala",
    culture: "adds Kaunos and Lycian ruins",
  },
  "italy-amalfi": {
    wind: "6-14 kn",
    marinas: "5 ports",
    line: "Naples to Amalfi",
    quiet: "adds Ischia anchorages",
    culture: "adds Pompeii day stop",
  },
  bvi: {
    wind: "14-20 kn",
    marinas: "6 moorings",
    line: "Tortola loop",
    quiet: "adds Anegada beaches",
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

function updateStartPoints() {
  const points = startPoints[regionSelect.value] || [];
  startSelect.innerHTML = points.map((point) => `<option value="${point}">${point}</option>`).join("");
}

regionSelect.addEventListener("change", updateStartPoints);
updateStartPoints();

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
  const response = await fetch("/api/generate-route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(routeRequest),
  });

  const text = await response.text();
  let result;

  try {
    result = JSON.parse(text);
  } catch {
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
