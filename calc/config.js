// config.js
const CONFIG = {
    maxBids: 8,
    maxVariantsPerBid: 5,
    costFields: [
        { id: 'waterCost', label: 'Water Cost ($)', type: 'number' },
        { id: 'waterVolume', label: 'Water Volume (gallons)', type: 'number' },
        { id: 'briteCansCost', label: 'Brite Cans Cost ($)', type: 'number' },
        { id: 'lidsCost', label: 'Lids Cost ($)', type: 'number' },
        { id: 'sleevePrintingCost', label: 'Sleeve/Printing Cost ($)', type: 'number' },
        { id: 'wrapCost', label: 'Wrap Cost ($)', type: 'number' },
        { id: 'cartonsCost', label: 'Cartons Cost ($)', type: 'number' },
        { id: 'holdersPaktekCost', label: 'Holders/Paktek Cost ($)', type: 'number' },
        { id: 'canningLaborCost', label: 'Canning Labor Cost ($)', type: 'number' },
        { id: 'printingLaborCost', label: 'Printing Labor Cost ($)', type: 'number' },
        { id: 'coPackingLaborCost', label: 'Co-Packing Labor Cost ($)', type: 'number' },
        { id: 'otherFees', label: 'Other Fees ($)', type: 'number' }
    ],
    // Scalable formula: Function to compute total cost from variant data
    calculateTotalCost: (variant) => {
        // Sum all cost fields; can be extended with logic (e.g., waterCost * waterVolume)
        return CONFIG.costFields.reduce((sum, field) => sum + (parseFloat(variant[field.id]) || 0), 0);
    },
    // Scalable scaling: Adjust costs based on quantity (example: 10% discount over 1000)
    applyScaling: (total, quantity) => {
        if (quantity > 1000) return total * 0.9; // Example discount
        return total;
    }
};
