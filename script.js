const routeForm = document.querySelector("#routeForm");
const routeOutput = document.querySelector("#routeOutput");

const routeData = {
  croatia: {
    wind: "12-18 kn",
    marinas: "5 marinas",
    line: "Split to Dubrovnik",
    quiet: "adds Solta and Lastovo",
    culture: "adds Korcula old town",
  },
  greece: {
    wind: "8-16 kn",
    marinas: "4 harbors",
    line: "Lefkas to Paxos",
    quiet: "adds Meganisi coves",
    culture: "adds Corfu old town",
  },
  italy: {
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
  const destination = formData.get("destination");
  const guests = formData.get("guests");
  const days = formData.get("days");
  const mood = formData.get("mood");
  const vessel = formData.get("vessel");
  const route = routeData[destination];
  const vesselPlan = vesselData[vessel];
  const focus = mood === "balanced" ? "balanced route" : route[mood];

  routeOutput.innerHTML = `
    <div class="route-loading">
      <span class="metric">Planning...</span>
      <small>Creating an AI route preview</small>
    </div>
  `;

  generateAiPreview({ destination, guests, days, mood, vessel })
    .then((preview) => {
      routeOutput.innerHTML = `
        <div class="ai-preview">
          <span class="metric">AI preview</span>
          <p>${formatPreview(preview)}</p>
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

  return result.preview;
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
