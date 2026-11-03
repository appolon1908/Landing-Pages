import { readFileSync } from "node:fs";
export const banned = JSON.parse(
  readFileSync(
    new URL("../_brand/banned-phrases.json", import.meta.url),
    "utf8",
  ),
);
export function strings(value, path = "$") {
  if (typeof value === "string") return [[path, value]];
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([key, v]) =>
      strings(v, `${path}.${key}`),
    );
  return [];
}
export function checkClaims(value) {
  const errors = [];
  for (const [path, text] of strings(value)) {
    if (/\[PLACEHOLDER/i.test(text))
      errors.push(`${path}: unresolved placeholder`);
    for (const phrase of banned.phrases) {
      for (const match of text.matchAll(new RegExp(phrase.pattern, "giu"))) {
        const clause = text
          .slice(0, match.index)
          .split(/[.!?;]/u)
          .at(-1);
        const explicitDenial =
          phrase.id === "guaranteed-outcome" &&
          /\bno (?:hay|ofrecemos|garantizamos) $|\bno hay [^.;!?]{0,90}\bni $|\bnot $/iu.test(
            clause,
          );
        if (!explicitDenial)
          errors.push(`${path}: unsupported claim (${phrase.id})`);
      }
    }
    if (
      /(?:[$]|RD\$)\s*\d|\d+(?:[.,]\d+)?\s*(?:%|\$|RD\$|min(?:utes|utos)?\b|hours?\b|heures?\b)/iu.test(
        text,
      )
    )
      errors.push(`${path}: unapproved numeric price, outcome or timing claim`);
  }
  return errors;
}
