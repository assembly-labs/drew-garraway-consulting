// script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bidForm');
    const calculateBtn = document.getElementById('calculate');
    const resultsDiv = document.getElementById('results');
    const downloadBtn = document.getElementById('download');
    let results = [];

    // Dynamically generate form based on config
    function initForm() {
        for (let bid = 1; bid <= CONFIG.maxBids; bid++) {
            const bidDiv = document.createElement('div');
            bidDiv.className = 'bid';
            bidDiv.innerHTML = `<h2>Bid ${bid}</h2>`;
            for (let varIdx = 1; varIdx <= CONFIG.maxVariantsPerBid; varIdx++) {
                const varDiv = document.createElement('div');
                varDiv.className = 'variant';
                varDiv.innerHTML = `<h3>Variant ${varIdx}</h3>
                    <label>Quantity (cans): <input type="number" name="bid${bid}_var${varIdx}_quantity" required></label>`;
                CONFIG.costFields.forEach(field => {
                    varDiv.innerHTML += `<label>${field.label}: <input type="${field.type}" name="bid${bid}_var${varIdx}_${field.id}"></label>`;
                });
                bidDiv.appendChild(varDiv);
            }
            form.appendChild(bidDiv);
        }
    }

    initForm();

    calculateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        results = [];
        const formData = new FormData(form);
        for (let bid = 1; bid <= CONFIG.maxBids; bid++) {
            for (let varIdx = 1; varIdx <= CONFIG.maxVariantsPerBid; varIdx++) {
                const quantity = parseFloat(formData.get(`bid${bid}_var${varIdx}_quantity`));
                if (!quantity) continue; // Skip empty variants
                const variant = { bid, variant: varIdx, quantity };
                CONFIG.costFields.forEach(field => {
                    variant[field.id] = parseFloat(formData.get(`bid${bid}_var${varIdx}_${field.id}`)) || 0;
                });
                let totalCost = CONFIG.calculateTotalCost(variant);
                totalCost = CONFIG.applyScaling(totalCost, quantity);
                const costPerCan = quantity > 0 ? totalCost / quantity : 0;
                results.push({ bid, variant: varIdx, quantity, totalCost: totalCost.toFixed(2), costPerCan: costPerCan.toFixed(2) });
            }
        }
        renderTable();
        downloadBtn.style.display = 'block';
    });

    function renderTable() {
        let html = '<table><thead><tr><th data-sort="bid">Bid ID</th><th data-sort="variant">Variant</th><th data-sort="quantity">Quantity</th><th data-sort="totalCost">Total Cost</th><th data-sort="costPerCan">Cost per Can</th></tr></thead><tbody>';
        results.forEach(row => {
            html += `<tr><td>${row.bid}</td><td>${row.variant}</td><td>${row.quantity}</td><td>${row.totalCost}</td><td>${row.costPerCan}</td></tr>`;
        });
        html += '</tbody></table>';
        resultsDiv.innerHTML = html;
        // Add sorting
        const headers = resultsDiv.querySelectorAll('th[data-sort]');
        headers.forEach(header => {
            header.addEventListener('click', () => sortTable(header.dataset.sort));
        });
    }

    function sortTable(key) {
        results.sort((a, b) => parseFloat(a[key]) - parseFloat(b[key]));
        renderTable();
    }

    downloadBtn.addEventListener('click', () => {
        const csv = 'Bid ID,Variant,Quantity,Total Cost,Cost per Can\n' + 
            results.map(row => `${row.bid},${row.variant},${row.quantity},${row.totalCost},${row.costPerCan}`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cost_calculations_${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    });
});
