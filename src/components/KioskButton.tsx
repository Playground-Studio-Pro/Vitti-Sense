import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface KioskButtonProps extends Omit<HTMLMotionProps<"button">, "onClick"> {
  variant?: 'primary' | 'secondary' | 'card';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const KioskButton: React.FC<KioskButtonProps> = ({ 
  variant = 'primary', 
  className, 
  children, 
  onClick,
  ...props 
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (props.disabled || isClicked) return;
    
    setIsClicked(true);
    
    // Visual feedback delay
    setTimeout(() => {
      onClick?.();
      // Reset after a bit in case component doesn't unmount
      setTimeout(() => setIsClicked(false), 200);
    }, 300);
  };

  // Base styles
  const baseStyles = "relative overflow-hidden cursor-pointer select-none touch-manipulation";
  
  // Variant styles
  const variants = {
    primary: "bg-primary-green text-white shadow-lg",
    secondary: "bg-white text-gray-500 border border-gray-200",
    card: "bg-white border border-gray-200 shadow-sm hover:border-primary-green text-left"
  };

  return (
    <motion.button
      className={twMerge(baseStyles, variants[variant], className)}
      onClick={handleClick}
      animate={isClicked ? { scale: 0.95 } : { scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
