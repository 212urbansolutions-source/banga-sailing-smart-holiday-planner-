const boatDetail = document.querySelector("#boatDetail");
const params = new URLSearchParams(window.location.search);

const yachtId = params.get("id") || params.get("yachtId");
const dateFrom = params.get("dateFrom") || "";
const dateTo = params.get("dateTo") || "";
const price = Number(params.get("price") || 0);
const currency = params.get("currency") || "EUR";
const source = params.get("source") || "nausys";

loadBoatDetail();

async function loadBoatDetail() {
  if (!boatDetail) return;

  if (!yachtId) {
    renderError("Missing yacht ID. Please open this page from the boat finder results.");
    return;
  }

  try {
    const response = await fetch(`/api/nausys-yacht?id=${encodeURIComponent(yachtId)}`);
    const data = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(data.error || "Could not load yacht details.");
    }

    renderBoat(data.yacht);
  } catch (error) {
    renderFallbackBoat(error.message);
  }
}

async function readJsonResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: "Boat detail API is not available yet." };
  }
}

function renderBoat(yacht) {
  const pictures = yacht.pictures?.length ? yacht.pictures : [yacht.mainPictureUrl].filter(Boolean);
  const heroImage = pictures[0] || "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=82";
  const specs = [
    ["Type", yacht.type || "Yacht"],
    ["Cabins", yacht.cabins || "On request"],
    ["Guests", yacht.berthsTotal || "On request"],
    ["WC", yacht.wc || "On request"],
    ["Year", yacht.buildYear || "On request"],
    ["Length", yacht.loa ? `${yacht.loa} m` : "On request"],
    ["Draft", yacht.draft ? `${yacht.draft} m` : "On request"],
    ["Engine", yacht.enginePower ? `${yacht.enginePower} hp` : "On request"],
  ];

  document.title = `${yacht.name} | Sailing Holidays`;

  boatDetail.innerHTML = `
    <section class="boat-hero-detail">
      <div class="boat-hero-media">
        <img src="${escapeHtml(heroImage)}" alt="${escapeHtml(yacht.name)} yacht charter" />
      </div>
      <div class="boat-summary-panel">
        <p class="eyebrow">${escapeHtml(source.toUpperCase())} live boat</p>
        <h1>${escapeHtml(yacht.name)}</h1>
        <p class="detail-subtitle">${escapeHtml(yacht.type || "Yacht charter")} | NAUSYS ID ${escapeHtml(String(yacht.id))}</p>
        <div class="detail-price">
          <strong>${formatPrice(price, currency)}</strong>
          <span>${escapeHtml(formatPeriod(dateFrom, dateTo))}</span>
        </div>
        <dl class="detail-mini-specs">
          <div><dt>Base</dt><dd>${escapeHtml(yacht.baseId ? `Base ID ${yacht.baseId}` : "On request")}</dd></div>
          <div><dt>Location</dt><dd>${escapeHtml(yacht.locationId ? `Location ID ${yacht.locationId}` : "On request")}</dd></div>
          <div><dt>Rating</dt><dd>${escapeHtml(String(yacht.rating || "New"))}</dd></div>
        </dl>
        <div class="detail-actions">
          <a class="button primary" href="mailto:hello@example.com?subject=${encodeURIComponent(`Charter inquiry for ${yacht.name}`)}">Request this boat</a>
          <a class="button light" href="index.html#planner">Plan route</a>
        </div>
      </div>
    </section>

    <section class="detail-section detail-grid-section">
      <div>
        <p class="eyebrow">Yacht specs</p>
        <h2>Boat information</h2>
        <div class="spec-table">
          ${specs.map(([label, value]) => `
            <div>
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(String(value))}</strong>
            </div>
          `).join("")}
        </div>
      </div>
      <aside class="detail-card">
        <h3>Availability</h3>
        <p>${escapeHtml(formatPeriod(dateFrom, dateTo))}</p>
        <p>Price and availability are read from NAUSYS test API. Final booking details should be verified before confirmation.</p>
      </aside>
    </section>

    <section class="detail-section">
      <p class="eyebrow">Gallery</p>
      <h2>Photos</h2>
      <div class="boat-gallery">
        ${pictures.slice(0, 6).map((picture, index) => `
          <img src="${escapeHtml(picture)}" alt="${escapeHtml(yacht.name)} photo ${index + 1}" />
        `).join("")}
      </div>
    </section>

    <section class="detail-section detail-grid-section">
      <div>
        <p class="eyebrow">Equipment</p>
        <h2>Included details</h2>
        <ul class="detail-feature-list">
          ${(yacht.equipmentHighlights || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          <li>${escapeHtml(String(yacht.standardEquipmentCount || 0))} equipment records available from NAUSYS</li>
        </ul>
      </div>
      <aside class="detail-card">
        <h3>Next integration step</h3>
        <p>Map NAUSYS base IDs, model IDs, equipment IDs and service IDs to readable names for a fully polished client page.</p>
      </aside>
    </section>
  `;
}

function renderFallbackBoat(message) {
  boatDetail.innerHTML = `
    <section class="detail-loading">
      <p class="eyebrow">Boat page</p>
      <h1>NAUSYS yacht ${escapeHtml(yachtId)}</h1>
      <p>${escapeHtml(message)} Showing the available booking shell for this live result.</p>
      <div class="detail-card">
        <h3>Availability</h3>
        <p>${escapeHtml(formatPeriod(dateFrom, dateTo))}</p>
        <p><strong>${escapeHtml(formatPrice(price, currency))}</strong></p>
        <p>Yacht ID: ${escapeHtml(yachtId)}</p>
      </div>
      <a class="button primary" href="mailto:hello@example.com?subject=${encodeURIComponent(`Charter inquiry for NAUSYS yacht ${yachtId}`)}">Request this boat</a>
    </section>
  `;
}

function renderError(message) {
  boatDetail.innerHTML = `
    <section class="detail-loading">
      <p class="eyebrow">Boat page</p>
      <h1>Boat not found</h1>
      <p>${escapeHtml(message)}</p>
      <a class="button primary" href="index.html#boat-finder">Back to boat finder</a>
    </section>
  `;
}

function formatPrice(value, currencyCode) {
  return value ? `${currencyCode} ${value.toLocaleString("en-US")}` : "Price on request";
}

function formatPeriod(from, to) {
  if (!from && !to) return "Dates on request";
  return `${from || "Start"} to ${to || "End"}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
