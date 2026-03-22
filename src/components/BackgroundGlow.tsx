import React from "react";

const STRONG_STATES = new Set(['S0_IDLE', 'S1_HOOK', 'S2_WHAT_IS', 'S8_QR', 'S9_DONE']);

export function BackgroundGlow({ currentState }: { currentState?: string }) {
  const strong = !currentState || STRONG_STATES.has(currentState);

  return (
    <>
      <div className="nb-bg">
        <div className="nb-blob nb-blob-1" />
        <div className="nb-blob nb-blob-2" />
        <div className="nb-blob nb-blob-3" />
      </div>
      <div
        className="nb-halo"
        style={{ opacity: strong ? 0.7 : 1, transition: 'opacity 0.8s ease' }}
      />
    </>
  );
}
