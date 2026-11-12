import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export const SwipeableRow = ({ children, onDelete, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const x = useMotionValue(0);

  // Background action opacity and scale based on drag distance
  const opacity = useTransform(x, [-80, -20, 0], [1, 0.5, 0]);

  const handleDragEnd = (_, info) => {
    if (disabled) return;
    if (info.offset.x < -40 || info.velocity.x < -300) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-rose-500 mb-2.5">
      {/* Background delete action revealed on swipe left */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-rose-600 text-white z-0"
      >
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            onDelete();
          }}
          className="flex flex-col items-center justify-center w-full h-full text-white font-medium text-xs gap-1 hover:bg-rose-700 active:scale-95 transition-transform"
          aria-label="Confirm swipe delete"
        >
          <Trash2 className="w-5 h-5" />
          <span>Delete</span>
        </button>
      </motion.div>

      {/* Foreground task content */}
      <motion.div
        drag={disabled ? false : 'x'}
        dragDirectionLock
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.08}
        animate={{ x: isOpen ? -80 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        onDragEnd={handleDragEnd}
        className="relative z-10 bg-white cursor-grab active:cursor-grabbing select-none"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SwipeableRow;

