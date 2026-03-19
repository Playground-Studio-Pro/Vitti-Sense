/**
 * ═══════════════════════════════════════════════════════════════════
 * PORTRAIT KIOSK MODE — Configuration
 * ═══════════════════════════════════════════════════════════════════
 *
 * Toggle this flag to enable/disable portrait kiosk mode.
 *
 * When ENABLED:
 *   - The app UI is rotated 90° counter-clockwise inside a 1920×1080
 *     landscape monitor, producing a 1080×1920 portrait experience.
 *   - The OS display orientation stays UNCHANGED (landscape).
 *   - Touch axes remain correct because no OS-level rotation occurs.
 *
 * When DISABLED:
 *   - The app renders in its normal landscape layout.
 *   - No CSS transforms are applied.
 *   - Zero impact on the existing app behavior.
 *
 * HOW TO TOGGLE:
 *   Option A — Change this constant and save:
 *     export const PORTRAIT_KIOSK_ENABLED = true;   // portrait mode ON
 *     export const PORTRAIT_KIOSK_ENABLED = false;  // portrait mode OFF
 *
 *   Option B — Use a URL query parameter (overrides the constant):
 *     http://localhost:3000/?portrait=1    → force ON
 *     http://localhost:3000/?portrait=0    → force OFF
 *
 *   Option C — Set an environment variable in your .env:
 *     VITE_PORTRAIT_KIOSK=true
 *
 * ═══════════════════════════════════════════════════════════════════
 */

// Master toggle — change this to `true` to enable portrait kiosk mode
export const PORTRAIT_KIOSK_ENABLED = true;

/**
 * Custom cursor toggle (only relevant when PORTRAIT_KIOSK_ENABLED = true).
 *
 * In portrait kiosk mode the native OS cursor is ALWAYS hidden via CSS
 * (since it points in the wrong direction relative to the rotated UI).
 *
 * This flag controls whether a *custom* in-app cursor is rendered:
 *   true  → a small rotated dot/ring cursor follows the pointer
 *   false → cursor is simply hidden (ideal for pure touchscreen kiosks)
 *
 * Can also be overridden via URL param:
 *   ?cursor=1  → force custom cursor ON
 *   ?cursor=0  → force custom cursor OFF (just hidden)
 */
export const CUSTOM_CURSOR_ENABLED = true;

/**
 * Resolves the effective portrait-kiosk state at runtime.
 * Priority: URL param > env var > constant above.
 */
export function isPortraitKioskActive(): boolean {
  // 1. Check URL query param  ?portrait=1 / ?portrait=0
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get('portrait');
    if (paramValue === '1' || paramValue === 'true') return true;
    if (paramValue === '0' || paramValue === 'false') return false;
  }

  // 2. Check Vite env variable
  try {
    const envValue = (import.meta as any).env?.VITE_PORTRAIT_KIOSK;
    if (envValue === 'true') return true;
    if (envValue === 'false') return false;
  } catch {
    // ignore if import.meta.env is unavailable
  }

  // 3. Fall back to the compile-time constant
  return PORTRAIT_KIOSK_ENABLED;
}

/**
 * Resolves whether the custom cursor should be shown.
 * Priority: URL param > constant.
 * Only meaningful when portrait kiosk mode is active.
 */
export function isCustomCursorActive(): boolean {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get('cursor');
    if (paramValue === '1' || paramValue === 'true') return true;
    if (paramValue === '0' || paramValue === 'false') return false;
  }
  return CUSTOM_CURSOR_ENABLED;
}
