import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Language } from '../data/content';
import { AppState } from '../hooks/useFSM';

interface HeaderProps {
  currentState: string;
  language: Language;
  onToggleLanguage: () => void;
  onBack: () => void;
  onExit: () => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentState,
  language,
  onToggleLanguage,
  onBack,
  onExit,
  onLogoClick
}) => {
  // Determine if Back button should be visible
  const showBack = currentState !== 'S9_DONE' && currentState !== 'S0_IDLE';

  return (
    <header className="absolute top-0 left-0 right-0 h-[clamp(80px,8vh,120px)] px-[clamp(32px,4vw,64px)] flex items-center justify-between z-50 bg-transparent">
      <div className="w-[clamp(120px,20vw,240px)] flex justify-start">
        {showBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-[clamp(48px,6vh,72px)] h-[clamp(48px,6vh,72px)] rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-[clamp(24px,3vh,32px)] h-[clamp(24px,3vh,32px)] text-text-black" />
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-center">
        {currentState !== 'S0_IDLE' && (
          <div onClick={onLogoClick} className="cursor-pointer active:scale-95 transition-transform">
            <img
              src="/itti-logo.svg"
              alt="ITTI"
              className="h-[clamp(40px,5vh,72px)] object-contain"
            />
          </div>
        )}
      </div>

      <div className="w-[clamp(120px,20vw,240px)] flex justify-end">
        <div className="flex items-center gap-[clamp(4px,0.5vw,12px)] bg-gray-100 rounded-full p-[clamp(4px,0.5vh,8px)]">
          <button
            onClick={language === 'es' ? onToggleLanguage : undefined}
            className={`px-[clamp(16px,2vw,32px)] py-[clamp(10px,1.5vh,20px)] min-w-[64px] rounded-full text-[clamp(14px,1.5vh,18px)] font-bold transition-all ${language === 'en'
              ? 'bg-white shadow-sm text-text-black'
              : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            EN
          </button>
          <button
            onClick={language === 'en' ? onToggleLanguage : undefined}
            className={`px-[clamp(16px,2vw,32px)] py-[clamp(10px,1.5vh,20px)] min-w-[64px] rounded-full text-[clamp(14px,1.5vh,18px)] font-bold transition-all ${language === 'es'
              ? 'bg-white shadow-sm text-text-black'
              : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            ES
          </button>
        </div>
      </div>
    </header>
  );
};
