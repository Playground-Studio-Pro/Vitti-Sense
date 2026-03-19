import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const InteractionButton: React.FC<Props> = ({ 
  onClick, 
  children, 
  className = "", 
  disabled = false
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (disabled || isClicked) return;
    setIsClicked(true);
    
    setTimeout(() => {
      onClick();
      setTimeout(() => setIsClicked(false), 200);
    }, 300);
  };

  return (
    <motion.button
      className={`relative overflow-hidden select-none ${className}`}
      onClick={handleClick}
      animate={isClicked ? { scale: 0.98 } : { scale: 1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};
