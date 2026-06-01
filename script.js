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
          ${renderMiniRouteMap(result.stops, start)}
          <p>${formatPreview(result.preview)}</p>
        </div>
      `;
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

function renderMiniRouteMap(stops, start) {
  const routeStops = normalizeStops(stops, start);
  const points = routeStops.map((stop, index) => {
    const progress = routeStops.length === 1 ? 0 : index / (routeStops.length - 1);
    return {
      ...stop,
      x: 10 + progress * 80,
      y: 58 - Math.sin(progress * Math.PI) * 26 + (index % 2 === 0 ? 0 : 10),
    };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");

  return `
    <div class="mini-route-map" aria-label="Generated route map">
      <svg viewBox="0 0 100 72" role="img" aria-label="Schematic route line">
        <path class="map-waterline" d="M0 54 C18 46 30 64 48 54 S76 46 100 56" />
        <path class="map-route" d="${path}" />
        ${points
          .map(
            (point, index) => `
              <g class="map-stop">
                <circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${index === 0 ? 3.7 : 3}" />
                <text x="${point.x.toFixed(1)}" y="${Math.max(8, point.y - 6).toFixed(1)}">${index + 1}</text>
              </g>
            `,
          )
          .join("")}
      </svg>
      <ol class="mini-route-stops">
        ${points
          .map(
            (point) => `
              <li>
                <strong>${escapeHtml(point.name)}</strong>
                <span>${escapeHtml(point.note || point.type || "Route stop")}</span>
              </li>
            `,
          )
          .join("")}
      </ol>
    </div>
  `;
}

function normalizeStops(stops, start) {
  const cleanStops = stops
    .filter((stop) => stop && stop.name)
    .slice(0, 8)
    .map((stop) => ({
      name: String(stop.name),
      type: String(stop.type || ""),
      note: String(stop.note || ""),
    }));

  if (!cleanStops.length) {
    return [
      { name: start, note: "Start marina" },
      { name: "Island stop", note: "Swim and lunch" },
      { name: "Sheltered bay", note: "Overnight anchorage" },
      { name: "Old town", note: "Dinner ashore" },
    ];
  }

  return cleanStops;
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
