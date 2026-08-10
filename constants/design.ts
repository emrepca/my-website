/**
 * Design skins.
 *
 * A "design" is a *visual skin only* — it never changes markup, routing or
 * behaviour. The active skin is published as `data-design` on <html>, which
 * every rule in `app/themes/neobrutalism.css` hooks onto.
 *
 * This axis is deliberately independent from the light/dark axis owned by
 * next-themes (which writes a `class` on the same element), so the two
 * combine freely: default+dark, neobrutalism+light, and so on.
 */
export const DESIGNS = ['default', 'neobrutalism'] as const

export type Design = (typeof DESIGNS)[number]

export const DEFAULT_DESIGN: Design = 'default'

/** localStorage key holding the visitor's choice. */
export const DESIGN_STORAGE_KEY = 'portfolio-design'

/** Attribute written on <html>. */
export const DESIGN_ATTRIBUTE = 'data-design'

export function isDesign(value: unknown): value is Design {
  return typeof value === 'string' && (DESIGNS as readonly string[]).includes(value)
}

/**
 * Blocking snippet injected into <head>.
 *
 * Applies the stored skin before first paint so a returning visitor never sees
 * the default design flash before their choice is restored — the same trick
 * next-themes uses for dark mode.
 */
export const DESIGN_INIT_SCRIPT = `(function(){try{var d=localStorage.getItem(${JSON.stringify(
  DESIGN_STORAGE_KEY,
)});document.documentElement.setAttribute(${JSON.stringify(
  DESIGN_ATTRIBUTE,
)},d===${JSON.stringify('neobrutalism')}?d:${JSON.stringify(
  DEFAULT_DESIGN,
)})}catch(e){document.documentElement.setAttribute(${JSON.stringify(
  DESIGN_ATTRIBUTE,
)},${JSON.stringify(DEFAULT_DESIGN)})}})();`
