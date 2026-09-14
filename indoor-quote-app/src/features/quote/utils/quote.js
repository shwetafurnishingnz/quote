import { DEFAULT_VARS } from "../../variables/utils/variables";

function round2(value) {
  return Math.round(value * 100) / 100;
}

/**
 * Template quote calculator for the requested blind quote flow.
 *
 * Accepts a blind array with per-blind length and sag, then applies
 * a materials + overhead + tax template and a margin multiplier.
 */
export function computeQuote(input, vars = DEFAULT_VARS) {
  if (!Array.isArray(input.blinds)) {
    const width = Number(input.width);
    const height = Number(input.height);
    const quantity = Number(input.quantity);

    const areaPerBlind = (width / 100) * (height / 100);
    const materials = vars.materials ?? vars.fabric ?? {};
    const overhead = vars.overhead ?? {};
    const taxes = vars.taxes ?? vars.rates ?? {};

    const fabricCost = (materials.fabricPricePerMetre ?? materials.fabricPrice ?? 0) * areaPerBlind;
    const labourCost = overhead.labourCost ?? 0;
    const storageCost = overhead.storageCost ?? 0;
    const bracketCost = materials.bracketCost ?? 0;
    const bottomRailCost = materials.bottomRailCost ?? 0;
    const mechanismCost = materials.mechanismCost ?? 0;

    const base = fabricCost + labourCost + storageCost + bracketCost + bottomRailCost + mechanismCost;
    const quoteBeforeTax = base * quantity * (taxes.marginMultiplier ?? 1);
    const gst = quoteBeforeTax * (taxes.gstRate ?? 0);
    const total = quoteBeforeTax + gst;

    return {
      areaPerBlind: round2(areaPerBlind),
      perBlindPrice: round2(Math.max(base, 0)),
      quantity,
      subtotal: round2(quoteBeforeTax),
      gst: round2(gst),
      total: round2(total),
      equation: `Quote before GST = (fabric + labour + storage + brackets + bottom rail + mechanism) × margin = ${round2(quoteBeforeTax)}; total = quote before GST + GST = ${round2(total)}`,
      breakdown: [
        { label: "Fabric", value: fabricCost },
        { label: "Labour", value: labourCost },
        { label: "Storage", value: storageCost },
        { label: "Brackets", value: bracketCost },
        { label: "Bottom rail", value: bottomRailCost },
        { label: "Mechanism", value: mechanismCost },
      ],
    };
  }

  const rows = input.blinds.map((blind) => ({
    length: Number(blind.length),
    sag: Number(blind.sag),
    brackets: Number(blind.brackets ?? 2),
  }));

  const lengthInvalid = rows.some((row) => !Number.isFinite(row.length) || row.length <= 0);
  const sagInvalid = rows.some((row) => !Number.isFinite(row.sag) || row.sag <= 0);

  if (lengthInvalid || sagInvalid) {
    return {
      blinds: rows,
      quantity: rows.length,
      subtotal: 0,
      gst: 0,
      total: 0,
      equation: "Quote is invalid — enter length and sag for every blind greater than zero.",
      breakdown: [],
    };
  }

  const materials = vars.materials ?? {};
  const overhead = vars.overhead ?? {};
  const taxes = vars.taxes ?? {};

  const fabricPrice = materials.fabricPricePerMetre ?? 0;
  const chainPrice = materials.chainPricePerMetre ?? 0;
  const bracketCost = materials.bracketCost ?? 0;
  const bottomRailCost = materials.bottomRailCost ?? 0;
  const bottomWeightCost = materials.bottomWeightCost ?? 0;
  const tubeCost = materials.tubeCost ?? 0;
  const corsepCost = materials.corsepCost ?? 0;
  const mechanismCost = materials.mechanismCost ?? 0;

  const labourCost = overhead.labourCost ?? 0;
  const storageCost = overhead.storageCost ?? 0;
  const gstRate = taxes.gstRate ?? 0;
  const marginMultiplier = taxes.marginMultiplier ?? 1;

  const breakdown = rows.map((row) => {
    const fabric = (row.length / 100) * fabricPrice;
    const chain = (row.length / 100) * 2.2 * chainPrice;
    const brackets = row.brackets * bracketCost;
    const bottomRail = bottomRailCost;
    const bottomWeight = bottomWeightCost;
    const tube = tubeCost;
    const corsep = corsepCost;
    const mechanism = mechanismCost;

    const cost = fabric + chain + brackets + bottomRail + bottomWeight + tube + corsep + mechanism + labourCost + storageCost;

    return {
      blind: `${row.length} × ${row.sag}`,
      fabric: round2(fabric),
      chain: round2(chain),
      brackets: round2(brackets),
      bottomRail: round2(bottomRail),
      bottomWeight: round2(bottomWeight),
      tube: round2(tube),
      corsep: round2(corsep),
      mechanism: round2(mechanism),
      labour: round2(labourCost),
      storage: round2(storageCost),
      total: round2(cost),
    };
  });

  const costBase = breakdown.reduce((sum, item) => sum + item.total, 0);
  const quoteBeforeTax = costBase * marginMultiplier;
  const gst = quoteBeforeTax * gstRate;
  const total = quoteBeforeTax + gst;

  return {
    blinds: rows,
    quantity: rows.length,
    subtotal: round2(quoteBeforeTax),
    gst: round2(gst),
    total: round2(total),
    equation: `Quote before GST = ((fabric + chain + brackets + bottom rail + bottom weight + tube + corsep + mechanism + labour + storage) × margin) = ${round2(quoteBeforeTax)}; GST = ${round2(gst)}; total = ${round2(total)}`,
    breakdown: breakdown.flatMap((item) => [
      { label: `${item.blind} fabric`, value: item.fabric },
      { label: `${item.blind} chain`, value: item.chain },
      { label: `${item.blind} brackets`, value: item.brackets },
      { label: `${item.blind} bottom rail`, value: item.bottomRail },
      { label: `${item.blind} bottom weight`, value: item.bottomWeight },
      { label: `${item.blind} tube`, value: item.tube },
      { label: `${item.blind} corsep`, value: item.corsep },
      { label: `${item.blind} mechanism`, value: item.mechanism },
      { label: `${item.blind} labour`, value: item.labour },
      { label: `${item.blind} storage`, value: item.storage },
    ]),
  };
}
