// ---------- DOM helpers ----------
const bidsContainer = document.getElementById("bidsContainer");
bidsContainer.classList.add("grid", "cols-1");

function makeEl(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else if (k === "text") el.textContent = v;
    else el.setAttribute(k, v);
  });
  children.forEach((c) => el.appendChild(c));
  return el;
}

function makeField(id, labelText, attrs) {
  const wrap = makeEl("div", { class: "field" });
  const label = makeEl("label", { for: id, text: labelText });
  const input = makeEl("input", Object.assign({ id, inputmode: "decimal" }, attrs || {}));
  input.addEventListener("input", () => clearError(wrap));
  wrap.append(label, input);
  return wrap;
}

function makeOut(id, label) {
  const box = makeEl("div", { class: "out", id });
  box.innerHTML = `<div class="label">${label}</div><div class="value">–</div>`;
  return box;
}

// ---------- Render ----------
function renderBid(bidIndex) {
  const bidCard = makeEl("section", { class: "panel", id: `bid-${bidIndex}` });
  const header = makeEl("div", { class: "panel-header" });
  header.append(makeEl("h2", { text: `Bid ${bidIndex + 1}` }), makeEl("span", { class: "chip", text: "click to expand" }));
  const content = makeEl("div", { class: "panel-content" });
  bidCard.append(header, content);

  if (bidIndex === 0) bidCard.classList.add("open");

  const tabs = makeEl("div", { class: "tabs" });
  const tabPanels = [];
  for (let v = 0; v < CONFIG.maxVariants; v++) {
    const tab = makeEl("button", { class: "tab" + (v === 0 ? " active" : ""), text: `Variant ${v + 1}`, type: "button" });
    tab.dataset.target = `bid-${bidIndex}-var-${v}`;
    tabs.appendChild(tab);

    const panel = makeEl("div", { id: tab.dataset.target });
    if (v !== 0) panel.style.display = "none";

    // Quantity
    const qtySection = makeEl("div", { class: "section" });
    qtySection.append(
      makeEl("h3", { text: "Quantity" }),
      makeField(`quantity-${bidIndex}-${v}`, "Quantity (cans)", { type: "number", min: 1, step: 1, placeholder: "e.g., 1000" })
    );
    panel.append(qtySection);

    // Categories
    const catGrid = makeEl("div", { class: "grid cols-3" });
    CONFIG.categories.forEach((cat) => {
      const sec = makeEl("div", { class: "section" });
      sec.append(makeEl("h3", { html: `${cat.icon} ${cat.label}` }));
      cat.fields.forEach((f) => {
        sec.append(makeField(`${f.key}-${bidIndex}-${v}`, f.label, f));
      });
      catGrid.append(sec);
    });
    panel.append(catGrid);

    // Outputs
    const outWrap = makeEl("div", { class: "outputs" });
    outWrap.append(makeOut(`total-${bidIndex}-${v}`, "Total Cost ($)"), makeOut(`cpc-${bidIndex}-${v}`, "Cost / Can ($)"));
    panel.append(outWrap);

    tabPanels.push(panel);
  }

  content.append(tabs, ...tabPanels);

  // Events
  header.addEventListener("click", () => bidCard.classList.toggle("open"));
  tabs.addEventListener("click", (e) => {
    if (!e.target.classList.contains("tab")) return;
    [...tabs.children].forEach((t) => t.classList.remove("active"));
    e.target.classList.add("active");
    tabPanels.forEach((p) => (p.style.display = "none"));
    document.getElementById(e.target.dataset.target).style.display = "block";
  });

  return bidCard;
}

// Render all bids
for (let b = 0; b < CONFIG.maxBids; b++) bidsContainer.appendChild(renderBid(b));

// ---------- Logic ----------
function getNumber(id) {
  const el = document.getElementById(id);
  const val = el && el.value !== "" ? Number(el.value) : 0;
  return isFinite(val) ? val : NaN;
}
function setOut(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const valEl = el.querySelector(".value");
  valEl.textContent = value;
  el.animate([{ transform: "scale(1)" }, { transform: "scale(1.02)" }, { transform: "scale(1)" }], { duration: 260, easing: "ease-out" });
}
function setError(fieldWrap, message) {
  clearError(fieldWrap);
  fieldWrap.classList.add("has-error");
  const err = makeEl("div", { class: "err", text: message });
  fieldWrap.appendChild(err);
  const input = fieldWrap.querySelector("input");
  input.style.borderColor = "var(--warn)";
  input.style.boxShadow = "0 0 0 2px rgba(239,68,68,.25)";
}
function clearError(fieldWrap) {
  const err = fieldWrap.querySelector(".err");
  if (err) err.remove();
  const input = fieldWrap.querySelector("input");
  if (input) {
    input.style.borderColor = "var(--border)";
    input.style.boxShadow = "none";
  }
}

function calcAll() {
  const results = [];
  for (let b = 0; b < CONFIG.maxBids; b++) {
    for (let v = 0; v < CONFIG.maxVariants; v++) {
      const scope = `${b}-${v}`;
      const qtyId = `quantity-${scope}`;
      const qtyElWrap = document.getElementById(qtyId)?.parentElement; // .field
      const qty = getNumber(qtyId);
      if (qtyElWrap) clearError(qtyElWrap);
      if (qty < 1) {
        if (qtyElWrap) setError(qtyElWrap, "Enter a quantity ≥ 1");
        continue;
      }

      // Sum categories/fields
      let total = 0;
      CONFIG.categories.forEach((cat) => {
        cat.fields.forEach((f) => {
          const n = getNumber(`${f.key}-${scope}`);
          total += Number.isNaN(n) ? 0 : n;
        });
      });
      const costPerCan = qty > 0 ? total / qty : 0;

      setOut(`total-${scope}`, formatMoney(total));
      setOut(`cpc-${scope}`, formatMoney(costPerCan));

      results.push({
        bid: b + 1,
        variant: v + 1,
        quantity: qty,
        totalCost: +(total.toFixed(4)),
        costPerCan: +(costPerCan.toFixed(6)),
      });
    }
  }
  renderResults(results);
  document.getElementById("downloadBtn").disabled = results.length === 0;
  return results;
}

function formatMoney(n) {
  if (!isFinite(n)) return "–";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 6 });
}

// ---------- Results Table ----------
const resultsTable = document.getElementById("resultsTable");
let currentSort = { key: "bid", dir: "asc" };

function renderResults(rows) {
  const tbody = resultsTable.querySelector("tbody");
  tbody.innerHTML = "";
  document.getElementById("resultsCount").textContent = `${rows.length} rows`;
  // sort
  rows.sort((a, b) => {
    const { key, dir } = currentSort;
    const av = a[key], bv = b[key];
    if (av === bv) return 0;
    return (av > bv ? 1 : -1) * (dir === "asc" ? 1 : -1);
  });
  // paint
  rows.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.bid}</td>
      <td>${r.variant}</td>
      <td>${r.quantity.toLocaleString()}</td>
      <td>${formatMoney(r.totalCost)}</td>
      <td>${formatMoney(r.costPerCan)}</td>
    `;
    tbody.appendChild(tr);
  });
}

resultsTable.querySelectorAll("th.sortable").forEach((th) => {
  th.addEventListener("click", () => {
    const key = th.dataset.key;
    currentSort = { key, dir: currentSort.key === key && currentSort.dir === "asc" ? "desc" : "asc" };
    const rows = collectCurrentRows();
    renderResults(rows);
  });
});

function collectCurrentRows() {
  const rows = [];
  for (let b = 0; b < CONFIG.maxBids; b++) {
    for (let v = 0; v < CONFIG.maxVariants; v++) {
      const qty = getNumber(`quantity-${b}-${v}`);
      if (qty < 1) continue;
      const totalText = document.getElementById(`total-${b}-${v}`)?.querySelector(".value")?.textContent || "$0.00";
      const cpcText = document.getElementById(`cpc-${b}-${v}`)?.querySelector(".value")?.textContent || "$0.00";
      const total = Number(totalText.replace(/[^0-9.\-]/g, "")) || 0;
      const cpc = Number(cpcText.replace(/[^0-9.\-]/g, "")) || 0;
      rows.push({ bid: b + 1, variant: v + 1, quantity: qty, totalCost: total, costPerCan: cpc });
    }
  }
  return rows;
}

// ---------- CSV (sanitized) ----------
function sanitizeForCSV(val) {
  const s = String(val);
  return /^[=+\-@]/.test(s) ? `'${s}` : s;
}
function downloadCSV(rows) {
  const header = ["Bid", "Variant", "Quantity", "Total Cost ($)", "Cost / Can ($)"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([
      sanitizeForCSV(r.bid),
      sanitizeForCSV(r.variant),
      sanitizeForCSV(r.quantity),
      sanitizeForCSV(r.totalCost),
      sanitizeForCSV(r.costPerCan),
    ].join(","));
  }
  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const ts = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  a.href = url; a.download = `cost_calculations_${ts}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

// ---------- Wire buttons ----------
document.getElementById("calcBtn").addEventListener("click", () => {
  calcAll();
  window.scrollTo({ top: document.querySelector(".results").offsetTop - 72, behavior: "smooth" });
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const rows = collectCurrentRows();
  if (!rows.length) return;
  downloadCSV(rows);
});
