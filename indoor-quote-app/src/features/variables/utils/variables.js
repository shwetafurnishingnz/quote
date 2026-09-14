// Grouped pricing variables for the indoor blind quote template.
export const STYLE_OPTIONS = [
  { key: "roller", label: "Roller" },
  { key: "venetian", label: "Venetian" },
  { key: "roman", label: "Roman" },
  { key: "cellular", label: "Cellular / honeycomb" },
];

export const FABRIC_OPTIONS = [
  { key: "blockout", label: "Blockout" },
  { key: "lightFilter", label: "Light filter" },
  { key: "sheer", label: "Sheer" },
];

export const MOUNT_OPTIONS = [
  { key: "inside", label: "Inside recess" },
  { key: "outside", label: "Outside recess" },
];

export const VAR_GROUPS = [
  {
    key: "materials",
    label: "Materials",
    fields: [
      { key: "fabricPricePerMetre", label: "Fabric price ($ / metre)", step: 1 },
      { key: "chainPricePerMetre", label: "Chain price ($ / metre)", step: 0.1 },
      { key: "bracketCost", label: "Bracket cost ($ / bracket)", step: 1 },
      { key: "bottomRailCost", label: "Bottom rail ($)", step: 1 },
      { key: "bottomWeightCost", label: "Bottom weight ($)", step: 1 },
      { key: "tubeCost", label: "Tube ($)", step: 1 },
      { key: "corsepCost", label: "Corsep ($)", step: 1 },
      { key: "mechanismCost", label: "Mechanism ($ / blind)", step: 1 },
    ],
  },
  {
    key: "overhead",
    label: "Overhead",
    fields: [
      { key: "labourCost", label: "Labour cost ($)", step: 1 },
      { key: "storageCost", label: "Storage cost ($)", step: 1 },
    ],
  },
  {
    key: "taxes",
    label: "Taxes",
    fields: [
      { key: "gstRate", label: "GST rate (e.g. 0.15)", step: 0.01 },
      { key: "marginMultiplier", label: "Margin multiplier", step: 0.5 },
    ],
  },
];

export const DEFAULT_VARS = {
  materials: {
    fabricPricePerMetre: 15,
    chainPricePerMetre: 5,
    bracketCost: 8,
    bottomRailCost: 10,
    bottomWeightCost: 6,
    tubeCost: 7,
    corsepCost: 4,
    mechanismCost: 12,
  },
  overhead: {
    labourCost: 30,
    storageCost: 10,
  },
  taxes: {
    gstRate: 0.15,
    marginMultiplier: 2,
  },
};

function toNumber(value, fallback) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return Number.isFinite(num) ? num : fallback;
}

function normalizeGroup(group, defaults) {
  const result = {};
  for (const key of Object.keys(defaults)) {
    result[key] = toNumber(group && group[key], defaults[key]);
  }
  return result;
}

export function normalizeVars(vars) {
  const source = vars || {};
  return {
    materials: normalizeGroup(source.materials, DEFAULT_VARS.materials),
    overhead: normalizeGroup(source.overhead, DEFAULT_VARS.overhead),
    taxes: normalizeGroup(source.taxes, DEFAULT_VARS.taxes),
  };
}
