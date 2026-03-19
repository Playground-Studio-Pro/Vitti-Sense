/**
 * ═══════════════════════════════════════════════════════════════════
 * PORTRAIT KIOSK MODE — React Wrapper Component
 * ═══════════════════════════════════════════════════════════════════
 *
 * This component wraps the entire <App /> in a portrait-kiosk shell
 * when portrait mode is enabled.
 *
 * Structure when ENABLED:
 *   <div class="portrait-kiosk-viewport">       ← fills 1920×1080
 *     <div class="portrait-kiosk-stage">         ← 1080×1920, rotated -90°
 *       <App />                                  ← app renders in portrait
 *     </div>
 *     <PortraitKioskCursor />                    ← custom cursor (optional)
 *     <div class="portrait-kiosk-indicator" />   ← dev badge
 *   </div>
 *
 * Structure when DISABLED:
 *   <App />                                      ← untouched, normal layout
 *
 * This file does NOT import or modify App.tsx in any way.
 * It simply wraps whatever children are passed to it.
 *
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isPortraitKioskActive, isCustomCursorActive } from './config';
import './portrait-kiosk.css';

interface PortraitKioskWrapperProps {
  children: React.ReactNode;
}

export function PortraitKioskWrapper({ children }: PortraitKioskWrapperProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [showCursor, setShowCursor] = useState<boolean>(false);

  useEffect(() => {
    // Resolve once on mount (URL params / env / constant)
    const portraitActive = isPortraitKioskActive();
    setIsActive(portraitActive);
    // Custom cursor only matters when portrait mode is ON
    setShowCursor(portraitActive && isCustomCursorActive());
  }, []);

  // ── Portrait mode OFF → render children as-is ────────────────
  if (!isActive) {
    return <>{children}</>;
  }

  // ── Portrait mode ON → wrap in kiosk viewport + rotated stage ─
  return (
    <div className="portrait-kiosk-viewport">
      {/* Rotated portrait stage */}
      <div className="portrait-kiosk-stage">
        {children}
      </div>

      {/* Custom cursor — follows pointer in viewport coordinates */}
      {showCursor && <PortraitKioskCursor />}

      {/* Dev indicator — shows on the physical landscape screen */}
      <PortraitKioskIndicator />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 *  CUSTOM CURSOR
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Why a custom cursor?
 *    The native OS cursor arrow stays in landscape orientation while
 *    the UI is rotated -90°. This makes the cursor look perpendicular
 *    to the content — confusing for users.
 *
 *  How it works:
 *    1. The native cursor is hidden via CSS (`cursor: none`).
 *    2. This component listens to `pointermove` on the document.
 *    3. It positions a small dot+ring graphic at the raw viewport
 *       coordinates (clientX, clientY).
 *    4. Because the custom cursor lives in the VIEWPORT layer (not
 *       inside the rotated stage), no coordinate transformation is
 *       needed — the pointer position maps directly.
 *    5. pointer-events: none ensures the cursor element never
 *       intercepts clicks/touches.
 *
 *  The cursor uses `requestAnimationFrame` for smooth 60fps tracking
 *  with zero layout thrash.
 *
 * ═══════════════════════════════════════════════════════════════════ */
function PortraitKioskCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef({ x: -100, y: -100 });
  const [isPressed, setIsPressed] = useState(false);

  // ── Pointer position tracking ─────────────────────────────────
  const updatePosition = useCallback(() => {
    if (cursorRef.current) {
      const { x, y } = posRef.current;
      // Offset by half the dot size (20px / 2 = 10px) to center on pointer
      cursorRef.current.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
    }
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      // Cancel any pending frame and schedule a new one
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    const handlePointerDown = () => setIsPressed(true);
    const handlePointerUp = () => setIsPressed(false);

    // Listen on the document so we track everywhere, including
    // over the rotated stage and any overlays.
    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('pointerleave', handlePointerUp, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [updatePosition]);

  return (
    <div
      ref={cursorRef}
      className={`portrait-kiosk-cursor${isPressed ? ' is-pressed' : ''}`}
    >
      <div className="portrait-kiosk-cursor-dot" />
      <div className="portrait-kiosk-cursor-ring" />
    </div>
  );
}

/**
 * A small, non-interactive badge in the corner of the physical
 * landscape screen showing that portrait-kiosk mode is active.
 * Useful during development/testing. Remove or hide in production
 * by deleting this component from the JSX above.
 */
function PortraitKioskIndicator() {
  return (
    <div className="portrait-kiosk-indicator">
      ⟳ Portrait Kiosk Mode
    </div>
  );
}

export default PortraitKioskWrapper;

