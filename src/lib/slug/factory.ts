import type { SlugStrategy } from "./strategies";
import { LithuanianTransliterationStrategy, UnicodeNormalizeStrategy } from "./strategies";

export type SluggerKind = "lt" | "unicode";

/** Simple Factory: grąžina paruoštą slug strategiją pagal poreikį. */
export function createSlugStrategy(kind: SluggerKind): SlugStrategy {
  switch (kind) {
    case "lt":
      return LithuanianTransliterationStrategy;
    case "unicode":
      return UnicodeNormalizeStrategy;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function createSlugify(kind: SluggerKind) {
  const strategy = createSlugStrategy(kind);
  return (input: string) => strategy.slugify(input);
}

