import { cn, formatDate, formatPrice } from "@/lib/utils";

describe("utils", () => {
  test("cn merges classnames", () => {
    expect(cn("a", false && "x", "b")).toBe("a b");
  });

  test("formatPrice formats eur", () => {
    const s = formatPrice(12.5);
    expect(typeof s).toBe("string");
    expect(s).toMatch(/12/);
    expect(s).toMatch(/€|EUR/);
  });

  test("formatDate formats lt date", () => {
    const s = formatDate(new Date("2026-04-02T00:00:00.000Z"));
    expect(typeof s).toBe("string");
    expect(s.length).toBeGreaterThan(0);
  });
});

