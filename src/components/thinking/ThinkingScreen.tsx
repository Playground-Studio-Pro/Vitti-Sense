import React, { useState, useEffect, useRef } from 'react';
import { NetworkBlob } from './NetworkBlob';
import { AnalysisFeed } from './AnalysisFeed';
import { motion, AnimatePresence } from 'framer-motion';

const PHASE_LABELS = {
  en: {
    early: 'analyzing connected signals',
    middle: 'comparing patterns and anomalies',
    final: 'preparing recommendation',
    synthesis: 'synthesizing insights',
  },
  es: {
    early: 'analizando señales conectadas',
    middle: 'comparando patrones y anomalías',
    final: 'preparando recomendación',
    synthesis: 'sintetizando perspectivas',
  },
} as const;

export type ThinkingScreenProps = {
  lines: string[];
  language: 'en' | 'es';
  onDone?: () => void;
};

/** Delay between isComplete=true and calling onDone — preserves a visible completion beat. */
const COMPLETION_BEAT_MS = 500;

export const ThinkingScreen: React.FC<ThinkingScreenProps> = ({ lines, language, onDone }) => {
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Keep onDone stable across renders without adding it to effect deps
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  // Guard against duplicate onDone calls if the component re-renders unexpectedly
  const calledDoneRef = useRef(false);

  useEffect(() => {
    // ── Empty lines guard ──────────────────────────────────────────────────
    // Skip the sequence entirely; call onDone after a short delay so callers
    // don't have to special-case zero-length input.
    if (lines.length === 0) {
      const t = setTimeout(() => {
        if (!calledDoneRef.current) {
          calledDoneRef.current = true;
          onDoneRef.current?.();
        }
      }, 500);
      return () => clearTimeout(t);
    }

    // ── Normal sequence ────────────────────────────────────────────────────
    let cancelled = false;
    let stepTimer: ReturnType<typeof setTimeout> | null = null;
    let synthTimer: ReturnType<typeof setTimeout> | null = null;
    let doneTimer: ReturnType<typeof setTimeout> | null = null;

    const delay = currentStep === -1 ? 500 : 2200;

    stepTimer = setTimeout(() => {
      if (cancelled) return;

      if (currentStep < lines.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Final step reached — enter synthesis phase
        setIsSynthesizing(true);

        synthTimer = setTimeout(() => {
          if (cancelled) return;

          // Mark complete first so the UI can render the completion state
          setIsComplete(true);

          // Then wait a beat before handing control back to the caller
          doneTimer = setTimeout(() => {
            if (cancelled) return;
            if (!calledDoneRef.current) {
              calledDoneRef.current = true;
              onDoneRef.current?.();
            }
          }, COMPLETION_BEAT_MS);
        }, 2500);
      }
    }, delay);

    return () => {
      cancelled = true;
      if (stepTimer) clearTimeout(stepTimer);
      if (synthTimer) clearTimeout(synthTimer);
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, [currentStep, lines.length]);

  const getPhase = (): 'early' | 'middle' | 'final' | 'synthesis' => {
    if (isSynthesizing) return 'synthesis';
    // Guard: no progress yet or empty lines — show early state
    if (currentStep < 0 || lines.length === 0) return 'early';
    const progress = (currentStep + 1) / lines.length;
    if (progress <= 0.33) return 'early';
    if (progress <= 0.66) return 'middle';
    return 'final';
  };

  const phase = getPhase();
  const phaseLabel = PHASE_LABELS[language][phase];

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden relative">
      {/* NetworkBlob — Dominant upper area */}
      <div className="flex-[6] min-h-0 w-full relative z-10 flex items-center justify-center">
        {/* Halo Gradient — Centered firmly behind the blob */}
        <div
          className="absolute inset-0 m-auto w-[60vmin] h-[60vmin] pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(circle, rgba(113,131,245,0.08) 0%, rgba(38,208,124,0.06) 35%, rgba(255,255,255,0) 70%)',
          }}
        />
        <div className="w-full h-full relative z-10">
          <NetworkBlob phase={phase} />
        </div>
      </div>

      {/* Analysis Feed — Tighter lower area, scrollable if needed */}
      <div className="flex-[4] min-h-0 w-full relative z-20 flex flex-col items-center justify-start pt-4 px-6 overflow-y-auto">
        <div className="w-full max-w-3xl pb-8">
          {/* Phase Status */}
          <div className="h-12 mb-4 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                  Status
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#26D07C] animate-pulse" />
                  <span className="text-base md:text-lg font-medium text-gray-800 tracking-tight">
                    {phaseLabel}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnalysisFeed
            lines={lines}
            currentIndex={currentStep}
            isComplete={isComplete}
          />
        </div>
      </div>
    </div>
  );
};
