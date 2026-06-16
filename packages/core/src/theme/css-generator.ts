import { primitive } from './tokens.js';

function flattenTokens(obj: Record<string, unknown>, prefix = ''): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(obj)) {
    const cssKey = prefix ? `${prefix}-${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      entries.push(...flattenTokens(value as Record<string, unknown>, cssKey));
    } else {
      entries.push([cssKey, String(value)]);
    }
  }
  return entries;
}

export function generatePrimitiveCSS(): string {
  const entries = flattenTokens(primitive);
  const vars = entries.map(([key, val]) => `  --${key}: ${val};`).join('\n');
  return `:root {\n${vars}\n}`;
}

export function generateSemanticCSS(): string {
  return `:root {
  /* Surface */
  --surface-primary: var(--color-avorio);
  --surface-secondary: var(--color-sabbia);
  --surface-tertiary: var(--color-grigio-100);
  --surface-inverse: var(--color-nero);
  --surface-brand: var(--color-cammello);

  /* Ink */
  --ink-primary: var(--color-testadimoro);
  --ink-secondary: var(--color-marroncaldo);
  --ink-tertiary: var(--color-grigio-500);
  --ink-inverse: var(--color-avorio);
  --ink-brand: var(--color-cammello);
  --ink-link: var(--color-marroncaldo);

  /* Accent */
  --accent-primary: var(--color-cammello);
  --accent-secondary: var(--color-oro);
  --accent-hover: var(--color-marroncaldo);

  /* Line */
  --line-subtle: var(--color-grigio-200);
  --line-default: var(--color-grigio-300);
  --line-strong: var(--color-marroncaldo);

  /* Focus */
  --focus-ring: var(--color-cammello);
}`;
}
