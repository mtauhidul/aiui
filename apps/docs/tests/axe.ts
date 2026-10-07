import { axe } from "vitest-axe";

/** axe with rules that jsdom can't evaluate turned off. */
export function checkA11y(container: Element) {
  return axe(container, { rules: { "color-contrast": { enabled: false }, region: { enabled: false } } });
}
