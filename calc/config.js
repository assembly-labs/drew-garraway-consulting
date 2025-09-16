// Configurable without touching layout/logic
const CONFIG = {
  maxBids: 8,
  maxVariants: 5,
  categories: [
    {
      key: "materials",
      label: "Materials",
      icon: "🥫",
      fields: [
        { key: "waterCost", label: "Water Cost ($)", type: "number", min: 0, step: "any" },
        { key: "waterGallons", label: "Water Volume (gallons)", type: "number", min: 0, step: "any" },
        { key: "briteCansCost", label: "Brite Cans Cost ($)", type: "number", min: 0, step: "any" },
        { key: "lidsCost", label: "Lids Cost ($)", type: "number", min: 0, step: "any" },
        { key: "sleevePrintingCost", label: "Sleeve/Printing Cost ($)", type: "number", min: 0, step: "any" },
      ],
    },
    {
      key: "packaging",
      label: "Packaging",
      icon: "📦",
      fields: [
        { key: "wrapCost", label: "Wrap Cost ($)", type: "number", min: 0, step: "any" },
        { key: "cartonsCost", label: "Cartons Cost ($)", type: "number", min: 0, step: "any" },
        { key: "holdersCost", label: "Holders/PakTek Cost ($)", type: "number", min: 0, step: "any" },
      ],
    },
    {
      key: "labor",
      label: "Labor",
      icon: "👷",
      fields: [
        { key: "canningLaborCost", label: "Canning Labor Cost ($)", type: "number", min: 0, step: "any" },
        { key: "printingLaborCost", label: "Printing Labor Cost ($)", type: "number", min: 0, step: "any" },
        { key: "copackingLaborCost", label: "Co-Packing Labor Cost ($)", type: "number", min: 0, step: "any" },
      ],
    },
    {
      key: "other",
      label: "Other Fees",
      icon: "💼",
      fields: [
        { key: "otherFees", label: "Other Fees ($)", type: "number", min: 0, step: "any" },
      ],
    },
  ],
};
