import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFSM } from './hooks/useFSM';
import { useInactivityTimer } from './hooks/useInactivityTimer';
import { Header } from './components/Header';
import { BackgroundGlow } from './components/BackgroundGlow';
import NeuralModeTransition from './components/NeuralModeTransition';
import { Language } from './data/content';
import {
  S0_Idle,
  S1_Hook,
  S2_WhatIs,
  S3_Role,
  S4_Scenario,
  S5_Question,
  S6_Thinking,
  S7_Result,
  S8_QR,
  S9_Done
} from './screens';
import { KIOSK_FRAME } from './config/kiosk';

export default function App() {
  const { state, dispatch } = useFSM();
  const [language, setLanguage] = useState<Language>('en');
  const [restartKey, setRestartKey] = useState(0);

  const [calibrationMode, setCalibrationMode] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.location.search.includes('kiosk-calibrate');
  });
  const [kioskFrame, setKioskFrame] = useState(KIOSK_FRAME);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle calibration mode: Ctrl + Shift + K
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCalibrationMode(prev => !prev);
        return;
      }

      // If not in calibration mode, do nothing
      if (!calibrationMode) return;

      const amt = e.shiftKey ? 1 : 10;
      const mult = e.altKey ? -1 : 1;
      const step = amt * mult;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setKioskFrame(prev => ({ ...prev, top: prev.top + step }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setKioskFrame(prev => ({ ...prev, bottom: prev.bottom + step }));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setKioskFrame(prev => ({ ...prev, left: prev.left + step }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setKioskFrame(prev => ({ ...prev, right: prev.right + step }));
          break;
        case '[':
          e.preventDefault();
          setKioskFrame(prev => ({ ...prev, scale: prev.scale - 0.05 * mult }));
          break;
        case ']':
          e.preventDefault();
          setKioskFrame(prev => ({ ...prev, scale: prev.scale + 0.05 * mult }));
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setKioskFrame(KIOSK_FRAME);
          break;
        case 'g':
        case 'G':
          e.preventDefault();
          setKioskFrame(prev => ({ ...prev, showGuides: !prev.showGuides }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [calibrationMode]);

  // Inactivity timeout: 1.5 minutes -> Reset to Idle
  useInactivityTimer(90000, () => {
    if (state.currentState !== 'S0_IDLE') {
      dispatch({ type: 'RESET' });
    }
  });

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  const handleRestartAnimation = () => {
    dispatch({ type: 'RESET' });
  };

  const renderScreen = () => {
    const commonProps = {
      dispatch,
      language,
      selectedRole: state.selectedRole,
      selectedScenario: state.selectedScenario
    };

    switch (state.currentState) {
      case 'S0_IDLE': return <S0_Idle key={restartKey} {...commonProps} />;
      case 'S1_HOOK': return <S1_Hook key={restartKey} {...commonProps} />;
      case 'S1_ENTER_NEURAL':
        return (
          <NeuralModeTransition
            key={restartKey}
            durationMs={2000}
            onComplete={() => dispatch({ type: 'GO_WHAT_IS' })}
          />
        );
      case 'S2_WHAT_IS': return <S2_WhatIs key={restartKey} {...commonProps} />;
      case 'S3_ROLE': return <S3_Role key={restartKey} {...commonProps} />;
      case 'S4_SCENARIO': return <S4_Scenario key={restartKey} {...commonProps} />;
      case 'S5_QUESTION': return <S5_Question key={restartKey} {...commonProps} />;
      case 'S6_THINKING': return <S6_Thinking key={restartKey} {...commonProps} />;
      case 'S7_RESULT': return <S7_Result key={restartKey} {...commonProps} />;
      case 'S8_QR': return <S8_QR key={restartKey} {...commonProps} />;
      case 'S9_DONE': return <S9_Done key={restartKey} {...commonProps} />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-screen bg-transparent text-text-black overflow-hidden relative font-sans selection:bg-primary-green/20">
      <BackgroundGlow currentState={state.currentState} />

      {/* --- CALIBRATION HUD --- */}
      {calibrationMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white font-mono text-sm px-4 py-2 rounded-lg z-[10000] pointer-events-none text-center shadow-lg border border-white/20">
          <div className="font-bold text-red-400 mb-1">CALIBRATION MODE</div>
          <div className="text-gray-300">
            T:{kioskFrame.top} R:{kioskFrame.right} B:{kioskFrame.bottom} L:{kioskFrame.left} S:{kioskFrame.scale.toFixed(2)}
          </div>
        </div>
      )}

      {/* --- SAFE FRAME WRAPPER --- */}
      <div
        className="w-full h-full relative flex flex-col pointer-events-none"
        style={{
          paddingTop: `${kioskFrame.top}px`,
          paddingRight: `${kioskFrame.right}px`,
          paddingBottom: `${kioskFrame.bottom}px`,
          paddingLeft: `${kioskFrame.left}px`,
          transform: `scale(${kioskFrame.scale})`,
          transformOrigin: 'center center',
          pointerEvents: 'auto', // Restore pointer events inside the padded area
        }}
      >
        {/* Calibration Guides */}
        {kioskFrame.showGuides && (
          <div className="absolute inset-0 border-4 border-red-500/80 pointer-events-none z-[9999]" style={{ margin: `${kioskFrame.top}px ${kioskFrame.right}px ${kioskFrame.bottom}px ${kioskFrame.left}px` }}>
            {/* Center markers */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-500/50" />
            <div className="absolute left-1/2 top-0 h-full w-[1px] bg-red-500/50" />
            <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-1 rotate-0 font-mono">
              Safe Frame: {kioskFrame.top}t {kioskFrame.right}r {kioskFrame.bottom}b {kioskFrame.left}l
            </div>
          </div>
        )}

        <div className="w-full h-full relative">
          <Header
            currentState={state.currentState}
            language={language}
            onToggleLanguage={toggleLanguage}
            onBack={() => dispatch({ type: 'BACK' })}
            onExit={() => dispatch({ type: 'RESET' })}
            onLogoClick={handleRestartAnimation}
          />

          <main className="w-full h-full pt-20 pb-8 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentState}
                initial={
                  state.currentState === 'S1_ENTER_NEURAL'
                    ? { y: '-10vh', opacity: 0 }
                    : { opacity: 0 }
                }
                animate={
                  state.currentState === 'S1_ENTER_NEURAL'
                    ? { y: 0, opacity: 1 }
                    : { y: 0, opacity: 1 }
                }
                exit={
                  state.currentState === 'S1_ENTER_NEURAL'
                    ? { y: '10vh', opacity: 0 }
                    : { opacity: 0 }
                }
                transition={{ duration: state.currentState === 'S1_ENTER_NEURAL' ? 1.5 : 0.2, ease: "easeInOut" }}
                className="w-full h-full"
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
