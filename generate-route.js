:root {
  --ink: #07323d;
  --muted: #567278;
  --paper: #f3fbf9;
  --sea: #009bb1;
  --teal: #00bfd0;
  --coral: #f6c400;
  --gold: #ffd33d;
  --night: #06313d;
  --line: rgba(7, 50, 61, 0.14);
  --white: #ffffff;
  --shadow: 0 20px 70px rgba(0, 91, 111, 0.24);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  color: var(--ink);
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background:
    linear-gradient(180deg, #e9fbfb 0, var(--paper) 520px, #fff8ed 100%);
  letter-spacing: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  display: block;
  width: 100%;
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px clamp(18px, 4vw, 56px);
  color: var(--white);
  background: linear-gradient(180deg, rgba(3, 53, 65, 0.68), rgba(3, 53, 65, 0));
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
}

.brand-mark {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: clamp(14px, 3vw, 32px);
  font-size: 0.95rem;
}

.nav-links a {
  opacity: 0.9;
}

.nav-links a:hover {
  opacity: 1;
}

.nav-cta,
.button {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  padding: 0 20px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.nav-cta {
  color: var(--ink);
  background: var(--white);
}

.hero {
  position: relative;
  min-height: 94vh;
  overflow: hidden;
  color: var(--white);
  background:
    linear-gradient(90deg, rgba(4, 55, 68, 0.76), rgba(0, 155, 177, 0.18) 58%, rgba(255, 200, 74, 0.16)),
    url("assets/hero-catamaran-adobe.jpg"),
    url("https://images.pexels.com/photos/32330651/pexels-photo-32330651.jpeg?auto=compress&cs=tinysrgb&w=2400")
      center 58% / cover;
  background-position:
    center,
    center 58%,
    center 58%;
  background-size:
    cover,
    cover,
    cover;
}

.hero-shade {
  position: absolute;
  inset: auto 0 0;
  height: 34%;
  background: linear-gradient(0deg, var(--paper), rgba(243, 251, 249, 0));
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(330px, 440px);
  gap: clamp(28px, 6vw, 80px);
  align-items: end;
  width: calc(100% - 36px);
  max-width: 1180px;
  min-height: 94vh;
  margin: 0 auto;
  padding: 124px 0 70px;
}

.hero-copy {
  max-width: 700px;
  padding-bottom: 38px;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--gold);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  max-width: 760px;
  margin-bottom: 18px;
  font-size: clamp(3.4rem, 9vw, 7.8rem);
  line-height: 0.88;
  letter-spacing: 0;
}

.hero-lede {
  max-width: 660px;
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.88);
  font-size: clamp(1.05rem, 2vw, 1.28rem);
  line-height: 1.55;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.button.primary {
  color: #062f39;
  background: var(--coral);
  box-shadow: 0 12px 34px rgba(246, 196, 0, 0.32);
}

.button.ghost {
  color: var(--white);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.36);
}

.button.full {
  width: 100%;
}

.planner-panel {
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 8px;
  padding: 24px;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--shadow);
  backdrop-filter: blur(16px);
}

.panel-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.panel-heading h2 {
  margin: 0;
  font-size: 1.35rem;
}

.planner-form {
  display: grid;
  gap: 15px;
}

label,
legend {
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
}

select,
input {
  width: 100%;
  height: 46px;
  margin-top: 7px;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 0 12px;
  color: var(--ink);
  background: var(--white);
  font: inherit;
}

textarea {
  width: 100%;
  min-height: 116px;
  margin-top: 7px;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 12px;
  color: var(--ink);
  background: var(--white);
  font: inherit;
  resize: vertical;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.segmented {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 0;
  border: 0;
  padding: 0;
}

.segmented legend {
  grid-column: 1 / -1;
  margin-bottom: 0;
}

.segmented label {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 0 8px;
  color: var(--ink);
  background: var(--white);
  text-align: center;
  text-transform: none;
}

.segmented input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.segmented label:has(input:checked) {
  border-color: var(--sea);
  color: var(--white);
  background: var(--sea);
}

.route-output {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 16px;
}

.route-output > div {
  min-height: 84px;
  border-radius: 8px;
  padding: 12px;
  background: #e5fbfb;
}

.route-output .route-loading,
.route-output .ai-preview {
  grid-column: 1 / -1;
}

.ai-preview p {
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.55;
}

.real-route-map {
  display: grid;
  grid-template-columns: minmax(220px, 0.9fr) minmax(0, 1fr);
  gap: 14px;
  align-items: stretch;
  margin: 12px 0 16px;
}

.leaflet-route-map {
  width: 100%;
  height: 280px;
  min-height: 190px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 155, 177, 0.22);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

.painted-route-map {
  background: #e5fbfb;
}

.painted-route-map svg {
  display: block;
  width: 100%;
  height: 100%;
}

.chart-land {
  fill: #f6e7bd;
  stroke: rgba(7, 50, 61, 0.16);
  stroke-width: 0.7;
}

.chart-island {
  fill: #fff2c8;
  stroke: rgba(7, 50, 61, 0.18);
  stroke-width: 0.6;
}

.chart-contour {
  fill: none;
  stroke: rgba(255, 255, 255, 0.55);
  stroke-dasharray: 2 3;
  stroke-linecap: round;
  stroke-width: 0.9;
}

.chart-route {
  fill: none;
  stroke: #f6c400;
  stroke-dasharray: 3 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.chart-stop {
  fill: #f6c400;
  stroke: #ffffff;
  stroke-width: 0.9;
}

.chart-stop-number {
  fill: #06313d;
  font-size: 3.5px;
  font-weight: 900;
  text-anchor: middle;
}

.chart-label {
  fill: #06313d;
  font-size: 3.1px;
  font-weight: 800;
  paint-order: stroke;
  stroke: rgba(255, 255, 255, 0.74);
  stroke-width: 1px;
}

.route-number-tooltip {
  border: 0;
  box-shadow: none;
  color: #06313d;
  background: transparent;
  font-size: 0.72rem;
  font-weight: 900;
}

.mini-route-stops {
  display: grid;
  gap: 8px;
  max-height: 230px;
  margin: 0;
  overflow: auto;
  padding: 0;
  list-style: none;
}

.mini-route-stops li {
  border: 1px solid rgba(0, 155, 177, 0.18);
  border-radius: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.72);
}

.mini-route-stops strong,
.mini-route-stops span {
  display: block;
}

.mini-route-stops strong {
  margin-bottom: 4px;
  color: var(--ink);
}

.mini-route-stops span {
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.35;
}

.route-error {
  border: 1px solid rgba(180, 53, 35, 0.26);
  background: #fff4e0;
}

.metric {
  display: block;
  margin-bottom: 6px;
  color: var(--sea);
  font-size: 1.08rem;
  font-weight: 900;
}

small {
  color: var(--muted);
  line-height: 1.35;
}

.trust-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  width: calc(100% - 36px);
  max-width: 1180px;
  margin: -18px auto 0;
  padding: 18px;
  border-radius: 8px;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 14px 40px rgba(0, 91, 111, 0.13);
}

.trust-strip span {
  border: 1px solid rgba(0, 191, 208, 0.24);
  border-radius: 999px;
  padding: 9px 14px;
  font-weight: 800;
  background: #f0ffff;
}

.section {
  width: calc(100% - 36px);
  max-width: 1180px;
  margin: 0 auto;
  padding: 94px 0 30px;
}

.section-head {
  display: grid;
  grid-template-columns: 0.75fr 1fr;
  gap: 28px;
  align-items: end;
  margin-bottom: 28px;
}

.section-head .eyebrow {
  grid-column: 1 / -1;
  margin-bottom: -18px;
}

h2 {
  margin-bottom: 0;
  font-size: clamp(2rem, 4vw, 3.7rem);
  line-height: 0.98;
}

.section-head p,
.route-copy p,
.feature-row p,
.card-body p {
  color: var(--muted);
  line-height: 1.6;
}

.yacht-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.yacht-card {
  overflow: hidden;
  border-radius: 8px;
  background: var(--white);
  box-shadow: 0 18px 46px rgba(0, 91, 111, 0.12);
}

.yacht-card img {
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.card-body {
  padding: 22px;
}

.card-body span {
  color: var(--coral);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
}

.card-body h3,
.feature-row h3,
.local-grid h3 {
  margin: 8px 0 10px;
  font-size: 1.2rem;
}

.finder-section {
  width: calc(100% - 36px);
  max-width: 1180px;
  margin: 76px auto 0;
  padding: 56px 0 20px;
  border-top: 1px solid var(--line);
}

.finder-head {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
  gap: 28px;
  align-items: end;
  margin-bottom: 22px;
}

.finder-head p:not(.eyebrow) {
  color: var(--muted);
  line-height: 1.6;
}

.finder-search {
  display: grid;
  grid-template-columns: 1.4fr 1fr 0.7fr 1fr auto;
  gap: 12px;
  align-items: end;
  border-radius: 8px;
  padding: 16px;
  background: var(--white);
  box-shadow: 0 18px 48px rgba(0, 91, 111, 0.12);
}

.finder-layout {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
  margin-top: 18px;
}

.finder-filters,
.finder-results-wrap {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 16px 42px rgba(0, 91, 111, 0.1);
}

.finder-filters {
  display: grid;
  gap: 16px;
  padding: 18px;
  position: sticky;
  top: 84px;
}

.mobile-filter-head,
.mobile-filter-bar {
  display: none;
}

.filter-block {
  display: grid;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}

.filter-block:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.filter-block h3 {
  margin: 0;
  font-size: 1rem;
}

.filter-block output {
  color: var(--sea);
  font-weight: 900;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--ink);
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: none;
}

.check-row input {
  width: 18px;
  height: 18px;
  margin: 0;
}

.finder-results-wrap {
  padding: 16px;
}

.finder-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.finder-toolbar span {
  color: var(--ink);
  font-weight: 900;
}

.finder-toolbar label {
  min-width: 190px;
}

.boat-results {
  display: grid;
  gap: 14px;
}

.boat-card {
  display: grid;
  grid-template-columns: minmax(230px, 0.42fr) minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid rgba(0, 155, 177, 0.16);
  border-radius: 8px;
  background: var(--white);
}

.boat-card img {
  height: 100%;
  min-height: 245px;
  object-fit: cover;
}

.boat-card-body {
  display: grid;
  gap: 14px;
  padding: 18px;
}

.boat-card-top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 14px;
}

.boat-card h3 {
  margin: 4px 0 5px;
  font-size: 1.35rem;
}

.boat-location {
  color: var(--muted);
  font-weight: 700;
}

.boat-badge {
  display: inline-flex;
  width: fit-content;
  border-radius: 999px;
  padding: 6px 10px;
  color: #06313d;
  background: var(--gold);
  font-size: 0.78rem;
  font-weight: 900;
}

.boat-price {
  text-align: right;
}

.boat-price strong {
  display: block;
  color: var(--sea);
  font-size: 1.45rem;
}

.boat-price span {
  color: var(--muted);
  font-size: 0.86rem;
}

.boat-specs,
.boat-includes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.boat-specs li,
.boat-includes li {
  border: 1px solid rgba(0, 155, 177, 0.18);
  border-radius: 999px;
  padding: 7px 10px;
  color: var(--muted);
  background: #f0ffff;
  font-size: 0.88rem;
  font-weight: 800;
}

.boat-card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.boat-card-actions small {
  color: var(--muted);
}

.boat-empty {
  border: 1px dashed rgba(0, 155, 177, 0.35);
  border-radius: 8px;
  padding: 22px;
  color: var(--muted);
  background: #f0ffff;
}

.local-section {
  display: grid;
  grid-template-columns: 0.76fr 1.24fr;
  gap: clamp(28px, 6vw, 70px);
  align-items: start;
  width: calc(100% - 36px);
  max-width: 1180px;
  margin: 70px auto 0;
  padding: 54px 0 34px;
  border-top: 1px solid var(--line);
}

.local-copy p,
.local-grid p,
.events-copy p,
.inquiry-section p {
  color: var(--muted);
  line-height: 1.6;
}

.local-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.local-grid article {
  min-height: 220px;
  border-radius: 8px;
  padding: 22px;
  background: var(--white);
  box-shadow: 0 16px 42px rgba(22, 38, 44, 0.09);
}

.local-grid span {
  color: var(--teal);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
}

.events-band {
  display: grid;
  grid-template-columns: minmax(280px, 0.82fr) minmax(0, 1fr);
  gap: clamp(24px, 5vw, 60px);
  align-items: center;
  width: calc(100% - 36px);
  max-width: 1180px;
  margin: 76px auto 0;
  padding: 18px;
  border-radius: 8px;
  background: var(--white);
  box-shadow: 0 18px 48px rgba(0, 91, 111, 0.13);
}

.events-media {
  min-height: 360px;
  border-radius: 6px;
  background:
    linear-gradient(180deg, rgba(16, 35, 41, 0.03), rgba(16, 35, 41, 0.2)),
    url("https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?auto=format&fit=crop&w=1200&q=80")
      center / cover;
}

.events-copy {
  padding: 20px clamp(8px, 3vw, 36px) 20px 0;
}

.event-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.button.light {
  color: var(--sea);
  background: #e4ffff;
}

.moments-section {
  width: calc(100% - 36px);
  max-width: 1180px;
  margin: 70px auto 0;
  padding: 30px 0 12px;
}

.moments-head {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
  gap: 28px;
  align-items: end;
  margin-bottom: 22px;
}

.moments-head .eyebrow {
  grid-column: 1 / -1;
  margin-bottom: -18px;
}

.moments-head p {
  color: var(--muted);
  line-height: 1.6;
}

.moments-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr 0.95fr;
  grid-auto-rows: 250px;
  gap: 14px;
}

.moment-card {
  position: relative;
  min-height: 230px;
  overflow: hidden;
  border-radius: 8px;
  color: var(--white);
  background: var(--night);
}

.moment-card.large {
  grid-row: span 2;
}

.moment-card.wide {
  grid-column: span 2;
}

.moment-card img {
  height: 100%;
  object-fit: cover;
  filter: saturate(1.04);
}

.moment-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 155, 177, 0.02), rgba(6, 49, 61, 0.66));
}

.moment-card div {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 18px;
  z-index: 1;
}

.moment-card span {
  color: #ffd79a;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
}

.moment-card h3 {
  max-width: 520px;
  margin: 7px 0 0;
  font-size: clamp(1.12rem, 2vw, 1.6rem);
  line-height: 1.12;
}

.taste-strip {
  display: grid;
  grid-template-columns: minmax(240px, 0.72fr) minmax(0, 1fr);
  gap: clamp(18px, 4vw, 46px);
  align-items: center;
  margin-top: 16px;
  overflow: hidden;
  border-radius: 8px;
  background: var(--white);
  box-shadow: 0 16px 42px rgba(0, 91, 111, 0.12);
}

.taste-strip img {
  height: 100%;
  min-height: 290px;
  object-fit: cover;
}

.taste-strip div {
  padding: 28px 28px 28px 0;
}

.taste-strip h3 {
  margin: 0 0 12px;
  font-size: clamp(1.5rem, 3vw, 2.45rem);
  line-height: 1.02;
}

.taste-strip p:not(.eyebrow) {
  color: var(--muted);
  line-height: 1.6;
}

.route-section {
  display: grid;
  grid-template-columns: 0.78fr 1.22fr;
  gap: clamp(28px, 6vw, 70px);
  align-items: center;
  margin-top: 66px;
  padding: 84px max(18px, calc((100vw - 1180px) / 2));
  color: var(--white);
  background: linear-gradient(135deg, #06313d, #006f82);
}

.route-copy p {
  color: rgba(255, 255, 255, 0.74);
}

.route-map {
  position: relative;
  min-height: 360px;
  overflow: hidden;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(0, 191, 208, 0.55), rgba(6, 49, 61, 0.78)),
    url("https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=1400&q=80")
      center / cover;
}

.route-map svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.route-map path {
  fill: none;
  stroke: var(--white);
  stroke-dasharray: 8 10;
  stroke-linecap: round;
  stroke-width: 4;
}

.port {
  position: absolute;
  z-index: 2;
  border-radius: 999px;
  padding: 8px 12px;
  color: var(--ink);
  background: var(--white);
  font-size: 0.82rem;
  font-weight: 900;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

.port-a {
  left: 7%;
  top: 22%;
}

.port-b {
  left: 34%;
  top: 28%;
}

.port-c {
  left: 52%;
  top: 43%;
}

.port-d {
  left: 68%;
  top: 63%;
}

.port-e {
  right: 7%;
  top: 46%;
}

.compact {
  padding-bottom: 82px;
}

.feature-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.feature-row article {
  border-top: 3px solid var(--gold);
  padding: 22px 0 0;
}

.inquiry-section {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(320px, 460px);
  gap: clamp(28px, 6vw, 80px);
  align-items: start;
  padding: 76px max(18px, calc((100vw - 1180px) / 2));
  background: linear-gradient(135deg, #e4ffff, #fff3d8);
}

.inquiry-form {
  display: grid;
  gap: 14px;
  border-radius: 8px;
  padding: 22px;
  background: var(--white);
  box-shadow: 0 16px 42px rgba(0, 91, 111, 0.12);
}

.footer {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 28px clamp(18px, 4vw, 56px);
  color: rgba(255, 255, 255, 0.74);
  background: var(--night);
}

@media (max-width: 900px) {
  .site-header {
    position: absolute;
  }

  .nav-links {
    display: none;
  }

  .hero-inner,
  .section-head,
  .yacht-grid,
  .finder-head,
  .finder-search,
  .finder-layout,
  .boat-card,
  .moments-head,
  .moments-grid,
  .taste-strip,
  .local-section,
  .local-grid,
  .events-band,
  .route-section,
  .feature-row,
  .inquiry-section {
    grid-template-columns: 1fr;
  }

  .hero-inner {
    align-items: start;
    padding-top: 104px;
  }

  .hero-copy {
    padding-bottom: 0;
  }

  .planner-panel {
    margin-bottom: 30px;
  }

  .finder-filters {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    display: none;
    max-height: 82vh;
    overflow: auto;
    border-radius: 16px 16px 0 0;
    padding: 18px 18px 26px;
    box-shadow: 0 -18px 48px rgba(0, 91, 111, 0.22);
  }

  body.filters-open .finder-filters {
    display: grid;
  }

  body.filters-open::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 49;
    background: rgba(6, 49, 61, 0.42);
  }

  .mobile-filter-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 8px;
  }

  .mobile-filter-head h3 {
    margin: 0;
  }

  .mobile-filter-bar {
    position: sticky;
    top: 0;
    z-index: 5;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: -16px -16px 14px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.96);
    border-bottom: 1px solid var(--line);
    backdrop-filter: blur(12px);
  }

  .mobile-filter-bar label {
    display: grid;
  }

  .finder-toolbar label {
    display: none;
  }

  .finder-search {
    position: sticky;
    top: 0;
    z-index: 4;
    margin-inline: -4px;
    padding: 12px;
  }

  .finder-search .button {
    width: 100%;
  }

  .boat-card img {
    min-height: 220px;
  }

  .moment-card.large,
  .moment-card.wide {
    grid-column: auto;
    grid-row: auto;
  }

  .taste-strip div {
    padding: 6px 22px 24px;
  }

  .events-copy {
    padding: 6px;
  }
}

@media (max-width: 560px) {
  .site-header {
    padding-inline: 14px;
  }

  .brand span:last-child {
    display: none;
  }

  .nav-cta {
    min-height: 40px;
    padding-inline: 14px;
  }

  .hero-inner,
  .section,
  .finder-section,
  .moments-section,
  .trust-strip {
    width: calc(100% - 28px);
  }

  h1 {
    font-size: clamp(3rem, 14vw, 3.6rem);
  }

  .field-grid,
  .route-output,
  .real-route-map,
  .segmented {
    grid-template-columns: 1fr;
  }

  .route-section {
    padding-inline: 14px;
  }

  .route-map {
    min-height: 300px;
  }

  .footer {
    flex-direction: column;
  }
}
