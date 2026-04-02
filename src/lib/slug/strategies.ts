export type SlugStrategy = {
  name: string;
  slugify: (input: string) => string;
};

function finalizeSlug(text: string): string {
  return text.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const LithuanianTransliterationStrategy: SlugStrategy = {
  name: "lt-transliteration",
  slugify: (input: string) =>
    finalizeSlug(
      input
        .toLowerCase()
        .replace(/[ąčęėįšųūž]/g, (c: string) => {
          const map: Record<string, string> = {
            ą: "a",
            č: "c",
            ę: "e",
            ė: "e",
            į: "i",
            š: "s",
            ų: "u",
            ū: "u",
            ž: "z",
          };
          return map[c] ?? c;
        }),
    ),
};

export const UnicodeNormalizeStrategy: SlugStrategy = {
  name: "unicode-normalize",
  slugify: (input: string) =>
    finalizeSlug(
      input
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
    ),
};

