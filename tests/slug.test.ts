import { createSlugify, createSlugStrategy } from "@/lib/slug/factory";

describe("slug strategies", () => {
  test.each([
    { input: "Ąžuolas Žalias", expected: "azuolas-zalias" },
    { input: "  Pagrindinė plokštė!  ", expected: "pagrindine-plokste" },
    { input: "Krepšelis (test)", expected: "krepselis-test" },
  ])("lt strategy slugifies: $input", ({ input, expected }) => {
    const slugify = createSlugify("lt");
    expect(slugify(input)).toBe(expected);
  });

  test.each([
    { input: "Crème brûlée", expected: "creme-brulee" },
    { input: "São Paulo", expected: "sao-paulo" },
  ])("unicode strategy slugifies: $input", ({ input, expected }) => {
    const slugify = createSlugify("unicode");
    expect(slugify(input)).toBe(expected);
  });

  test("factory returns named strategy", () => {
    const s = createSlugStrategy("lt");
    expect(s.name).toBe("lt-transliteration");
    expect(typeof s.slugify).toBe("function"); // assert type
  });
});

