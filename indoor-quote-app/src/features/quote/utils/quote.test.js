import { describe, expect, it } from "vitest";
import { computeQuote } from "./quote";
import { DEFAULT_VARS } from "../../variables/utils/variables";

describe("computeQuote", () => {
  it("accepts a per-blind input array and returns a quoted total based on materials, overhead and tax inputs", () => {
    const result = computeQuote(
      {
        blinds: [
          { length: 120, sag: 160, brackets: 2 },
          { length: 90, sag: 140, brackets: 2 },
        ],
        style: "roller",
        fabric: "blockout",
        mount: "inside",
      },
      DEFAULT_VARS
    );

    expect(result.blinds).toHaveLength(2);
    expect(result.quantity).toBe(2);
    expect(result.subtotal).toBeGreaterThan(0);
    expect(result.gst).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(result.subtotal);
  });

  it("applies a margin multiplier to the quote before GST", () => {
    const result = computeQuote(
      {
        blinds: [{ length: 120, sag: 160, brackets: 2 }],
        style: "roller",
        fabric: "blockout",
        mount: "inside",
      },
      {
        ...DEFAULT_VARS,
        taxes: {
          ...DEFAULT_VARS.taxes,
          gstRate: 0.15,
          marginMultiplier: 2,
        },
      }
    );

    expect(result.subtotal).toBeGreaterThan(0);
    expect(result.total).toBe(result.subtotal + result.gst);
  });
});
