import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export interface AnalysisFeedProps {
  lines: string[];
  currentIndex: number;
  isComplete: boolean;
}

type StepStatus = 'complete' | 'current' | 'pending';

const STATUS_COLORS = {
  complete: {
    icon: '#26D07C',
    text: '#242424',
    subtext: '#26D07C',
    bg: 'rgba(38, 208, 124, 0.06)',
    border: 'rgba(38, 208, 124, 0.18)',
  },
  current: {
    icon: '#7183F5',
    text: '#242424',
    subtext: '#7183F5',
    bg: 'rgba(113, 131, 245, 0.08)',
    border: 'rgba(113, 131, 245, 0.22)',
  },
  pending: {
    icon: '#FF5A5F',
    text: '#7A7A7A',
    subtext: '#FF5A5F',
    bg: 'rgba(255, 90, 95, 0.025)',
    border: 'rgba(255, 90, 95, 0.14)',
  },
};

function getStepStatus(
  stepIndex: number,
  currentIndex: number,
  isComplete: boolean,
): StepStatus {
  if (currentIndex < 0) return 'pending';
  if (stepIndex < currentIndex) return 'complete';
  if (stepIndex === currentIndex) return isComplete ? 'complete' : 'current';
  return 'pending';
}

const CurrentIndicator: React.FC = () => (
  <div className="relative flex h-5 w-5 items-center justify-center">
    <motion.div
      className="absolute h-4 w-4 rounded-full border"
      style={{
        borderColor: '#7183F5',
        boxShadow: '0 0 10px rgba(113, 131, 245, 0.18)',
      }}
      animate={{ scale: [1, 1.18, 1], opacity: [0.75, 1, 0.75] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
    />
    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#7183F5' }} />
  </div>
);

const PendingIndicator: React.FC = () => (
  <div className="flex h-5 w-5 items-center justify-center">
    <div
      className="h-2.5 w-2.5 rounded-full"
      style={{ backgroundColor: '#FF5A5F', opacity: 0.75 }}
    />
  </div>
);

const CompleteIndicator: React.FC = () => (
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    className="flex h-5 w-5 items-center justify-center"
  >
    <Check size={18} strokeWidth={2.5} color="#26D07C" />
  </motion.div>
);

export const AnalysisFeed: React.FC<AnalysisFeedProps> = ({ lines, currentIndex, isComplete }) => {
  return (
    <div className="w-full max-w-xl mx-auto font-sans px-2">
      <div className="space-y-2 md:space-y-3">
        {lines.map((line, stepIndex) => {
          const status = getStepStatus(stepIndex, currentIndex, isComplete);
          const colors = STATUS_COLORS[status];

          return (
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: stepIndex * 0.04 }}
              className="flex items-center gap-3 rounded-xl border px-3 py-2 md:px-4 md:py-3 backdrop-blur-sm"
              style={{ backgroundColor: colors.bg, borderColor: colors.border }}
            >
              <div className="flex-shrink-0">
                {status === 'complete' && <CompleteIndicator />}
                {status === 'current' && <CurrentIndicator />}
                {status === 'pending' && <PendingIndicator />}
              </div>

              <div className="min-w-0">
                <div
                  className={`truncate text-sm md:text-base ${status === 'pending' ? 'font-normal' : 'font-medium'}`}
                  style={{ color: colors.text }}
                >
                  {line}
                </div>
                <div
                  className="mt-0.5 text-xs font-medium tracking-wide uppercase"
                  style={{ color: colors.subtext }}
                >
                  {status === 'complete' && 'Completed'}
                  {status === 'current' && 'Processing'}
                  {status === 'pending' && 'Pending'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
