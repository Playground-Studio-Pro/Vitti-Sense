/**
 * Portrait Kiosk Mode — Public API
 *
 * Usage:
 *   import { PortraitKioskWrapper } from './portrait-kiosk';
 *
 * Files in this folder:
 *   config.ts                  — toggle flag + runtime resolver
 *   portrait-kiosk.css         — all rotation / layout CSS
 *   PortraitKioskWrapper.tsx   — React wrapper component
 */

export { PortraitKioskWrapper } from './PortraitKioskWrapper';
export { isPortraitKioskActive, PORTRAIT_KIOSK_ENABLED, isCustomCursorActive, CUSTOM_CURSOR_ENABLED } from './config';
