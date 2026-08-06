import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const MagneticButton = ({ children, className = '', onClick, ...props }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.35;
    const y = (clientY - (top + height / 2)) * 0.35;
    setPosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y, scale: isHovered ? 1.04 : 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 16, mass: 0.1 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center cursor-pointer transition-colors group overflow-hidden ${className}`}
      {...props}
    >
      {/* Dynamic Hover Glow Pulse */}
      {isHovered && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.25, scale: 1.5 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-full bg-slate-100/20 blur-md pointer-events-none"
        />
      )}
      {children}
    </motion.button>
  );
};
