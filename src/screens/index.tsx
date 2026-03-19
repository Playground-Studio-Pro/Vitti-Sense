import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Language,
  Role,
  Scenario,
  UI_STRINGS,
  ROLES,
  SCENARIOS,
  QR_URL
} from '../data/content';
import { AppState, Action } from '../hooks/useFSM';
import { Chart } from '../components/Chart';
import { ThinkingScreen } from '../components/thinking';
import { ArrowRight, Check, Search, BrainCircuit, FileText, Database, Briefcase, ShieldAlert, Settings, Headphones } from 'lucide-react';

interface ScreenProps {
  dispatch: React.Dispatch<Action>;
  language: Language;
  selectedRole: Role | null;
  selectedScenario: Scenario | null;
}

import { InteractionButton } from '../components/InteractionButton';

// --- S0: IDLE ---
export const S0_Idle: React.FC<ScreenProps> = ({ dispatch, language }) => {
  return (
    <InteractionButton
      className="h-full w-full flex flex-col items-center justify-center cursor-pointer relative overflow-hidden bg-transparent"
      onClick={() => dispatch({ type: 'START' })}
    >
      <motion.div
        initial={{ opacity: 0.8, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1.05 }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="text-center flex flex-col items-center gap-[5vh] z-10 relative pointer-events-none"
      >
        <div className="flex flex-col items-center justify-center mb-[14vh] w-full">
          <img src="/itti-logo.svg" alt="ITTI" className="h-[20vmin] object-contain" />
        </div>
        <div className="w-[22vmin] h-[22vmin] bg-primary-green/10 rounded-full flex items-center justify-center mb-8">
          <BrainCircuit className="w-[12vmin] h-[12vmin] text-primary-green" />
        </div>
        <img src="/vitti-sense-black.svg" alt="Vitti Sense" className="h-[12vmin] object-contain mt-4" />
        <p className="text-gray-500 text-[4vmin] uppercase tracking-[0.2em] animate-pulse mt-8">
          {UI_STRINGS[language].tapToStart}
        </p>
      </motion.div>
    </InteractionButton>
  );
};

import { KioskButton } from '../components/KioskButton';

// --- S1: HOOK ---
export const S1_Hook: React.FC<ScreenProps> = ({ dispatch, language }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-[5vw] text-center max-w-[90vw] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-[6vh]"
      >
        <h1 className="text-[7vmin] font-bold text-text-black leading-[1.1]">
          {UI_STRINGS[language].hookTitle}
        </h1>
        <p className="text-[3.5vmin] text-gray-600 leading-relaxed max-w-[80%] mx-auto">
          {UI_STRINGS[language].hookSubtitle}
        </p>
        <div className="pt-[4vh]">
          <KioskButton
            onClick={() => dispatch({ type: 'ENTER_NEURAL_MODE' })}
            className="px-[12vw] py-[3vh] rounded-full text-[3vmin] font-semibold flex items-center justify-center gap-4 mx-auto"
          >
            {UI_STRINGS[language].startDemo}
            <ArrowRight className="w-[3vmin] h-[3vmin]" />
          </KioskButton>
        </div>
      </motion.div>
    </div>
  );
};

// --- S2: WHAT IS ---
export const S2_WhatIs: React.FC<ScreenProps> = ({ dispatch, language }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'GO_ROLE' });
    }, 3500); // ~3.5 seconds to read bullets
    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-8 text-center max-w-3xl mx-auto">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-bold mb-12"
      >
        {UI_STRINGS[language].whatIsTitle}
      </motion.h2>

      <div className="space-y-6 text-left">
        {UI_STRINGS[language].whatIsBullets.map((bullet, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.4 + 0.2 }}
            className="flex items-center gap-4 text-2xl text-gray-700"
          >
            <div className="w-8 h-8 rounded-full bg-primary-green/20 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-primary-green" />
            </div>
            {bullet}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- S3: ROLE ---
export const S3_Role: React.FC<ScreenProps> = ({ dispatch, language }) => {
  const getRoleIcon = (id: string) => {
    const iconClass = "w-[5vmin] h-[5vmin] text-chart-blue";
    switch (id) {
      case 'sales': return <Briefcase className={iconClass} />;
      case 'risk': return <ShieldAlert className={iconClass} />;
      case 'operations': return <Settings className={iconClass} />;
      case 'cx': return <Headphones className={iconClass} />;
      default: return <BrainCircuit className={iconClass} />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-[5vw]">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[5vmin] font-bold mb-[6vh] text-center"
      >
        {UI_STRINGS[language].selectRole}
      </motion.h2>

      <div className="flex flex-col gap-[3vh] w-full max-w-[80vw] lg:max-w-[60vw]">
        {ROLES.map((role, index) => (
          <KioskButton
            key={role.id}
            variant="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              boxShadow: [
                "0 0 0px rgba(113, 131, 245, 0)",
                "0 0 20px rgba(113, 131, 245, 0.25)",
                "0 0 0px rgba(113, 131, 245, 0)"
              ],
              borderColor: [
                "rgba(229, 231, 235, 1)", // gray-200
                "rgba(113, 131, 245, 0.6)", // chart-blue
                "rgba(229, 231, 235, 1)"  // gray-200
              ]
            }}
            transition={{
              delay: index * 0.1,
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              },
              borderColor: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            onClick={() => dispatch({ type: 'SELECT_ROLE', role })}
            className="p-[3vh] rounded-3xl group flex items-center gap-[4vw] border-2"
          >
            <div className="w-[10vmin] h-[10vmin] bg-gray-50 rounded-full flex items-center justify-center shrink-0 shadow-inner">
              {getRoleIcon(role.id)}
            </div>
            <h3 className="text-[3.5vmin] font-semibold text-text-black group-hover:text-chart-blue transition-colors">
              {language === 'en' ? role.labelEn : role.labelEs}
            </h3>
            <ArrowRight className="w-[4vmin] h-[4vmin] text-gray-300 ml-auto group-hover:text-chart-blue" />
          </KioskButton>
        ))}
      </div>
    </div>
  );
};

// --- S4: SCENARIO ---
export const S4_Scenario: React.FC<ScreenProps> = ({ dispatch, language, selectedRole }) => {
  const roleScenarios = SCENARIOS.filter(s => s.roleId === selectedRole?.id);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-[5vw]">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[5vmin] font-bold mb-[6vh] text-center"
      >
        {UI_STRINGS[language].selectScenario}
      </motion.h2>

      <div className="flex flex-col gap-[3vh] w-full max-w-[80vw] lg:max-w-[60vw]">
        {roleScenarios.map((scenario, index) => (
          <KioskButton
            key={scenario.id}
            variant="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              boxShadow: [
                "0 0 0px rgba(38, 208, 124, 0)",
                "0 0 20px rgba(38, 208, 124, 0.25)",
                "0 0 0px rgba(38, 208, 124, 0)"
              ],
              borderColor: [
                "rgba(229, 231, 235, 1)", // gray-200
                "rgba(38, 208, 124, 0.6)", // primary-green
                "rgba(229, 231, 235, 1)"  // gray-200
              ]
            }}
            transition={{
              delay: index * 0.1,
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              },
              borderColor: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            onClick={() => dispatch({ type: 'SELECT_SCENARIO', scenario })}
            className="p-[3vh] rounded-3xl flex items-start gap-[2vw] group border-2 text-left w-full"
          >
            <div className="mt-[0.5vh] p-[1.5vh] bg-gray-50 rounded-2xl group-hover:bg-primary-green/10 shrink-0 shadow-inner">
              <Search className="w-[4vmin] h-[4vmin] text-gray-400 group-hover:text-primary-green transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-[2.5vmin] font-bold text-text-black mb-[1vh] group-hover:text-primary-green transition-colors">
                {language === 'en' ? scenario.titleEn : scenario.titleEs}
              </h3>
              <p className="text-[2vmin] text-gray-500 leading-relaxed">
                {language === 'en' ? scenario.descEn : scenario.descEs}
              </p>
            </div>
            <ArrowRight className="w-[4vmin] h-[4vmin] text-gray-300 ml-auto self-center group-hover:text-primary-green group-hover:translate-x-1 transition-all" />
          </KioskButton>
        ))}
      </div>
    </div>
  );
};

// --- S5: QUESTION ---
export const S5_Question: React.FC<ScreenProps> = ({ dispatch, language, selectedScenario }) => {
  const [text, setText] = useState('');
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  const fullText = language === 'en' ? selectedScenario?.questionEn : selectedScenario?.questionEs;

  useEffect(() => {
    if (!fullText) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTypingFinished(true);
      }
    }, 45); // Slower typing (~45ms per char)

    return () => clearInterval(interval);
  }, [fullText, dispatch]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-8 max-w-[80vw] mx-auto">
      <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-[4vh] min-h-[30vh] flex flex-col">
        <div className="flex items-center gap-3 mb-[3vh] border-b border-gray-100 pb-[2vh]">
          <div className="w-[1.5vh] h-[1.5vh] rounded-full bg-red-400" />
          <div className="w-[1.5vh] h-[1.5vh] rounded-full bg-yellow-400" />
          <div className="w-[1.5vh] h-[1.5vh] rounded-full bg-green-400" />
        </div>

        <div className="flex-1 text-[3vmin] font-medium text-text-black font-mono leading-relaxed">
          {text}
          <span className="animate-pulse inline-block w-[1vmin] h-[3vmin] bg-primary-green ml-1 align-middle"></span>
        </div>

        <div className="mt-auto flex justify-end pt-[3vh]">
          <motion.div
            animate={isTypingFinished ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{
              duration: 1.5,
              repeat: isTypingFinished ? Infinity : 0,
              repeatType: "reverse"
            }}
          >
            <KioskButton
              onClick={() => isTypingFinished && dispatch({ type: 'SUBMIT_QUESTION' })}
              disabled={!isTypingFinished}
              className={`px-[3vh] py-[1.5vh] rounded-xl text-[2vmin] font-bold flex items-center gap-[1vh] transition-colors cursor-pointer disabled:cursor-not-allowed ${isTypingFinished
                ? 'bg-primary-green text-white shadow-[0_10px_15px_-3px_rgba(38,208,124,0.3)]'
                : 'bg-gray-100 text-gray-400 shadow-none'
                }`}
            >
              {UI_STRINGS[language].send}
              <ArrowRight className={`w-[2.5vmin] h-[2.5vmin] ${isTypingFinished ? 'text-white' : 'text-gray-400'}`} />
            </KioskButton>
          </motion.div>
        </div>
      </div>
      {!isTypingFinished && (
        <p className="mt-[4vh] text-gray-400 text-[2vmin] uppercase tracking-widest animate-pulse">
          {UI_STRINGS[language].typing}
        </p>
      )}
    </div>
  );
};

// --- S6: THINKING ---
export const S6_Thinking: React.FC<ScreenProps> = ({ dispatch, language, selectedScenario }) => {
  if (!selectedScenario) return null;

  const lines =
    language === 'es'
      ? selectedScenario.result.thinkingSignalsEs
      : selectedScenario.result.thinkingSignalsEn;

  return (
    <ThinkingScreen
      lines={lines}
      language={language}
      onDone={() => dispatch({ type: 'FINISH_THINKING' })}
    />
  );
};

// --- S7: RESULT ---
export const S7_Result: React.FC<ScreenProps> = ({ dispatch, language, selectedScenario }) => {
  if (!selectedScenario) return null;
  const { result } = selectedScenario;

  return (
    <div className="h-full w-full flex flex-col px-[8vw] py-[3vh] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col max-w-[84vw] mx-auto w-full h-full"
      >
        <h2 className="text-[2vmin] font-bold text-gray-400 uppercase tracking-widest mb-[2vh] text-center shrink-0">
          {UI_STRINGS[language].results}
        </h2>

        <div className="flex flex-col gap-[2vh] h-full overflow-y-auto overflow-x-hidden pb-[6vh] px-[2vw]">
          {/* Insight Card */}
          <div className="bg-white p-[3vh] rounded-3xl border-l-[1vmin] border-primary-green shadow-sm shrink-0 mt-[1vh]">
            <h3 className="text-[3.5vmin] font-bold text-text-black leading-snug">
              {language === 'en' ? result.insightEn : result.insightEs}
            </h3>
          </div>

          {/* Evidence List */}
          <div className="bg-gray-50 p-[3vh] rounded-3xl shrink-0">
            <h4 className="text-[2vmin] font-semibold text-gray-500 uppercase mb-[2vh] flex items-center gap-2">
              <FileText className="w-[2.5vmin] h-[2.5vmin]" /> Evidence
            </h4>
            <ul className="space-y-[1.5vh]">
              {(language === 'en' ? result.evidenceEn : result.evidenceEs).map((item, i) => (
                <li key={i} className="flex items-start gap-[2vw] text-gray-700 text-[2.5vmin]">
                  <Check className="w-[3vmin] h-[3vmin] text-primary-green shrink-0 mt-[0.5vh]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources */}
          <h4 className="text-[2vmin] font-semibold text-gray-500 uppercase mb-[2vh] mt-[2vh] flex items-center gap-2">
            <Database className="w-[2.5vmin] h-[2.5vmin]" /> {UI_STRINGS[language].sourcesTitle}
          </h4>
          <div className="flex gap-[1vw] flex-wrap shrink-0">
            {(language === 'en' ? result.sourcesEn : result.sourcesEs).map((source, i) => (
              <span key={i} className="px-[2vw] py-[1vh] bg-blue-50 text-chart-blue text-[2vmin] font-medium rounded-full flex items-center gap-[1vw]">
                <Database className="w-[2vmin] h-[2vmin]" /> {source}
              </span>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-[2vh] flex flex-col justify-center min-h-[25vh] shrink-0 mt-[2vh]">
            <Chart chartSpec={result.chartSpec} language={language} />
            <p className="text-center text-gray-400 text-[1.5vmin] italic mt-[2vh]">
              {UI_STRINGS[language].demoDataDisclaimer}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-[2vh] mt-auto pt-[2vh] shrink-0">
            <KioskButton
              onClick={() => dispatch({ type: 'SHOW_QR' })}
              className="w-full py-[3vh] rounded-2xl font-bold text-[3vmin]"
            >
              {UI_STRINGS[language].scanToTake}
            </KioskButton>
            <KioskButton
              variant="secondary"
              onClick={() => dispatch({ type: 'BACK' })}
              className="w-full py-[2.5vh] rounded-2xl font-medium text-[2.5vmin]"
            >
              {UI_STRINGS[language].exploreAnother}
            </KioskButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- S8: QR ---
export const S8_QR: React.FC<ScreenProps> = ({ dispatch, language }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-sm w-full"
      >
        <div className="mb-8">
          <QRCodeSVG value={QR_URL} size={240} className="mx-auto" />
        </div>
        <p className="text-gray-600 mb-8 font-medium">
          {UI_STRINGS[language].scanToTake}
        </p>

        <div className="space-y-3">
          <KioskButton
            onClick={() => dispatch({ type: 'FINISH_DEMO' })}
            className="w-full py-3 rounded-xl font-bold"
          >
            {UI_STRINGS[language].scanButton}
          </KioskButton>
          <KioskButton
            variant="secondary"
            onClick={() => dispatch({ type: 'BACK' })}
            className="w-full py-2 text-sm font-medium border-none shadow-none hover:bg-gray-50"
          >
            {UI_STRINGS[language].backToResults}
          </KioskButton>
        </div>
      </motion.div>
    </div>
  );
};

// --- S9: DONE ---
export const S9_Done: React.FC<ScreenProps> = ({ dispatch, language }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'RESET' });
    }, 2000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-8 text-center bg-primary-green text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
          <Check className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-bold mb-4">
          {UI_STRINGS[language].thankYou}
        </h2>
        <p className="text-white/80 animate-pulse">
          {UI_STRINGS[language].resetting}
        </p>
      </motion.div>
    </div>
  );
};
