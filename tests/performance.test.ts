import { createSlugify } from "@/lib/slug/factory";

/**
 * Performance test (kategorija): tikslas – parodyti, kad testuose turime našumo matavimą.
 * Čia nedarome griežto benchmark'o, tik patikriname, kad operacija yra pakankamai greita.
 */
describe("performance", () => {
  test("slugify is fast for 10k inputs", () => {
    const slugify = createSlugify("lt");
    const inputs = Array.from({ length: 10_000 }, (_, i) => `Ąžuolas testas ${i}`);

    const t0 = Date.now();
    for (const s of inputs) slugify(s);
    const t1 = Date.now();

    const ms = t1 - t0;
    // Assert: tikriname ribą su dideliu rezervu, kad testas nebūtų trapus.
    expect(ms).toBeLessThan(500);
  });
});

