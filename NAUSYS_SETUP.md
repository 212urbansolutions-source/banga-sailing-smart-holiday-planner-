<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Boat Details | Sailing Holidays</title>
    <meta
      name="description"
      content="Detailed yacht charter page with live NAUSYS boat information, pictures, price, dates, specs, equipment and inquiry options."
    />
    <link rel="stylesheet" href="styles.css?v=boat-inline-detail" />
  </head>
  <body class="boat-detail-page">
    <header class="detail-header">
      <a class="brand detail-brand" href="index.html#top" aria-label="Sailing Holidays home">
        <span class="brand-mark">S</span>
        <span>Sailwise AI</span>
      </a>
      <a class="button light" href="index.html#boat-finder">Back to boats</a>
    </header>

    <main class="boat-detail" id="boatDetail">
      <section class="detail-loading">
        <p class="eyebrow">Live charter detail</p>
        <h1>Loading yacht details...</h1>
        <p>Connecting to NAUSYS and preparing the boat page.</p>
      </section>
    </main>

    <script>
      const boatDetail = document.querySelector("#boatDetail");
      const params = new URLSearchParams(window.location.search);
      const yachtId = params.get("id") || params.get("yachtId");
      const dateFrom = params.get("dateFrom") || "";
      const dateTo = params.get("dateTo") || "";
      const price = Number(params.get("price") || 0);
      const listPrice = Number(params.get("listPrice") || 0);
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
        const heroImage =
          pictures[0] ||
          "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=82";

        const modelTitle = [yacht.builderName, yacht.modelName].filter(Boolean).join(" ");
        const baseLine = [yacht.baseName, yacht.locationName].filter(Boolean).join(", ");
        const readableName = modelTitle || yacht.name;
        const heroFacts = compactRows([
          ["Type", yacht.type],
          ["Cabins", yacht.cabins],
          ["Guests", yacht.berthsTotal],
          ["WC", yacht.wc],
          ["Year", yacht.buildYear],
          ["Length", meters(yacht.loa)],
        ]);

        const accommodation = compactRows([
          ["Guest cabins", yacht.cabins],
          ["Crew cabins", yacht.cabinsCrew],
          ["Cabin berths", yacht.berthsCabin],
          ["Salon berths", yacht.berthsSalon],
          ["Crew berths", yacht.berthsCrew],
          ["Total guests", yacht.berthsTotal],
          ["Bathrooms", yacht.wc],
          ["Crew WC", yacht.wcCrew],
        ]);

        const technical = compactRows([
          ["Builder / model", modelTitle],
          ["Category", yacht.categoryName || yacht.type],
          ["Build year", yacht.buildYear],
          ["Refit year", yacht.refitYear],
          ["Length", meters(yacht.loa)],
          ["Beam", meters(yacht.beam)],
          ["Draft", meters(yacht.draft)],
          ["Engines", yacht.engines],
          ["Engine power", yacht.enginePower ? `${yacht.enginePower} hp` : ""],
          ["Fuel tank", litres(yacht.fuelTank)],
          ["Water tank", litres(yacht.waterTank)],
          ["Sail type ID", yacht.sailTypeId],
          ["Steering type ID", yacht.steeringTypeId],
        ]);

        const commercial = compactRows([
          ["Charter company", yacht.companyName],
          ["Base", yacht.baseName],
          ["Location", yacht.locationName],
          ["Check-in", yacht.checkIn],
          ["Check-out", yacht.checkOut],
          ["Security deposit", yacht.deposit ? formatPrice(Number(yacht.deposit), currency) : ""],
          ["Insured deposit", yacht.depositWhenInsured ? formatPrice(Number(yacht.depositWhenInsured), currency) : ""],
          ["Agency commission", yacht.commission ? `${Number(yacht.commission) * 100}%` : ""],
          ["Rating", yacht.rating],
          ["Reviews", yacht.reviews],
        ]);

        const ids = compactRows([
          ["NAUSYS yacht ID", yacht.id],
          ["Model ID", yacht.modelId],
          ["Company ID", yacht.companyId],
          ["Base ID", yacht.baseId],
          ["Location ID", yacht.locationId],
        ]);

        const availableStandard = yacht.standardEquipment || [];
        const availableExtra = yacht.additionalEquipment || [];

        document.title = `${yacht.name} | Sailing Holidays`;

        boatDetail.innerHTML = `
          <section class="boat-hero-detail">
            <div class="boat-hero-media detail-hero-gallery">
              <img class="detail-main-photo" src="${escapeHtml(heroImage)}" alt="${escapeHtml(yacht.name)} yacht charter" />
              ${pictures.slice(1, 4).map((picture, index) => `
                <img src="${escapeHtml(picture)}" alt="${escapeHtml(yacht.name)} detail photo ${index + 2}" />
              `).join("")}
            </div>
            <div class="boat-summary-panel">
              <p class="eyebrow">${escapeHtml(source.toUpperCase())} live boat</p>
              <h1>${escapeHtml(yacht.name)}</h1>
              <p class="detail-subtitle">${escapeHtml(readableName)}${baseLine ? ` | ${escapeHtml(baseLine)}` : ""}</p>
              <div class="detail-price">
                <strong>${formatPrice(price, currency)}</strong>
                ${listPrice ? `<span>List price ${escapeHtml(formatPrice(listPrice, currency))}</span>` : ""}
                <span>${escapeHtml(formatPeriod(dateFrom, dateTo))}</span>
              </div>
              <dl class="detail-mini-specs">
                ${heroFacts.slice(0, 6).map(([label, value]) => `
                  <div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(String(value))}</dd></div>
                `).join("")}
              </dl>
              <div class="detail-actions">
                <a class="button primary" href="mailto:hello@example.com?subject=${encodeURIComponent(`Charter inquiry for ${yacht.name}`)}">Request this boat</a>
                <a class="button light" href="index.html#planner">Plan route</a>
              </div>
            </div>
          </section>

          <section class="detail-section detail-booking-strip">
            <div>
              <span>Dates</span>
              <strong>${escapeHtml(formatPeriod(dateFrom, dateTo))}</strong>
            </div>
            <div>
              <span>Base</span>
              <strong>${escapeHtml(baseLine || yacht.baseId || "Base on request")}</strong>
            </div>
            <div>
              <span>Price</span>
              <strong>${escapeHtml(formatPrice(price, currency))}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>Live NAUSYS offer</strong>
            </div>
          </section>

          ${yacht.highlights || yacht.note ? `
            <section class="detail-section detail-copy-section">
              <p class="eyebrow">Description</p>
              <h2>About this yacht</h2>
              ${yacht.highlights ? `<p>${escapeHtml(yacht.highlights)}</p>` : ""}
              ${yacht.note ? `<p>${escapeHtml(yacht.note)}</p>` : ""}
            </section>
          ` : ""}

          <section class="detail-section detail-grid-section">
            <div>
              <p class="eyebrow">Yacht specs</p>
              <h2>Accommodation</h2>
              ${renderSpecTable(accommodation)}
            </div>
            <aside class="detail-card booking-card">
              <h3>Booking snapshot</h3>
              <p class="detail-card-price">${escapeHtml(formatPrice(price, currency))}</p>
              <p>${escapeHtml(formatPeriod(dateFrom, dateTo))}</p>
              <p>Offer price and availability come from NAUSYS. Final booking, extras, and payment terms should be verified before confirmation.</p>
              <a class="button primary full" href="mailto:hello@example.com?subject=${encodeURIComponent(`Charter inquiry for ${yacht.name}`)}">Send inquiry</a>
            </aside>
          </section>

          <section class="detail-section">
            <p class="eyebrow">Technical</p>
            <h2>Boat dimensions and systems</h2>
            ${renderSpecTable(technical)}
          </section>

          <section class="detail-section">
            <p class="eyebrow">Gallery</p>
            <h2>Photos from NAUSYS</h2>
            <div class="boat-gallery">
              ${pictures.slice(0, 6).map((picture, index) => `
                <img src="${escapeHtml(picture)}" alt="${escapeHtml(yacht.name)} photo ${index + 1}" />
              `).join("")}
            </div>
          </section>

          <section class="detail-section detail-grid-section">
            <div>
              <p class="eyebrow">Equipment</p>
              <h2>Included equipment</h2>
              <ul class="detail-feature-list">
                ${(yacht.equipmentHighlights || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                ${availableStandard.slice(0, 12).map((item) => `<li>${escapeHtml(equipmentLabel(item))}</li>`).join("")}
                ${!availableStandard.length ? `<li>${escapeHtml(String(yacht.standardEquipmentCount || 0))} standard equipment records</li>` : ""}
              </ul>
            </div>
            <aside class="detail-card">
              <h3>Optional extras</h3>
              ${availableExtra.length ? `
                <div class="detail-id-list">
                  ${availableExtra.slice(0, 8).map((item) => `
                    <div><span>${escapeHtml(equipmentLabel(item))}</span><strong>${escapeHtml(priceLabel(item))}</strong></div>
                  `).join("")}
                </div>
              ` : `<p>${escapeHtml(String(yacht.additionalEquipmentCount || 0))} additional equipment records available in NAUSYS.</p>`}
            </aside>
          </section>

          ${(yacht.prices?.length || yacht.services?.length || yacht.regularDiscounts?.length) ? `
            <section class="detail-section detail-grid-section">
              <div>
                <p class="eyebrow">Offer details</p>
                <h2>Prices, services and discounts</h2>
                ${renderRows("Price records", yacht.prices)}
                ${renderRows("Services", yacht.services)}
                ${renderRows("Discounts", yacht.regularDiscounts)}
              </div>
              <aside class="detail-card">
                <h3>Payment note</h3>
                <p>These are catalogue records from NAUSYS. Some test API records are IDs only, so final client-facing pricing should be confirmed before booking.</p>
              </aside>
            </section>
          ` : ""}

          <section class="detail-section detail-grid-section">
            <div>
              <p class="eyebrow">Charter base</p>
              <h2>Location and operator data</h2>
              ${renderSpecTable(commercial)}
            </div>
            <aside class="detail-card">
              <h3>NAUSYS catalogue references</h3>
              <div class="detail-id-list">
                ${ids.map(([label, value]) => `
                  <div><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>
                `).join("")}
              </div>
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
              <h3>Availability offer</h3>
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

      function compactRows(rows) {
        return rows
          .map(([label, value]) => [label, value || ""])
          .filter(([, value]) => value !== "" && value !== null && value !== undefined);
      }

      function renderSpecTable(rows) {
        if (!rows.length) {
          return `<p class="detail-muted">Details are not included in this NAUSYS test record yet.</p>`;
        }

        return `
          <div class="spec-table">
            ${rows.map(([label, value]) => `
              <div>
                <span>${escapeHtml(label)}</span>
                <strong>${escapeHtml(String(value))}</strong>
              </div>
            `).join("")}
          </div>
        `;
      }

      function renderRows(title, rows = []) {
        if (!rows.length) return "";

        return `
          <div class="detail-data-group">
            <h3>${escapeHtml(title)}</h3>
            <div class="detail-id-list">
              ${rows.slice(0, 8).map((item) => `
                <div>
                  <span>${escapeHtml(item.name || item.type || item.id || "Record")}</span>
                  <strong>${escapeHtml(item.price ? `${item.currency || currency} ${item.price}` : item.periodFrom ? `${item.periodFrom} - ${item.periodTo || ""}` : item.id || "Available")}</strong>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }

      function equipmentLabel(item) {
        return item.name || (item.equipmentId ? `Equipment ID ${item.equipmentId}` : item.id ? `Equipment record ${item.id}` : "Equipment item");
      }

      function priceLabel(item) {
        if (item.price) return `${item.currency || currency} ${item.price}`;
        if (item.obligatory) return "Obligatory";
        return item.priceMeasureId ? `Measure ID ${item.priceMeasureId}` : "On request";
      }

      function meters(value) {
        return value ? `${value} m` : "";
      }

      function litres(value) {
        return value ? `${value} l` : "";
      }

      function escapeHtml(value) {
        return String(value ?? "")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }
    </script>
  </body>
</html>
