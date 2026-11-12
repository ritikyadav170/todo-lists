import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, ...props }) => {
      const {
        drag,
        dragDirectionLock,
        dragConstraints,
        dragElastic,
        onDragEnd,
        whileHover,
        whileTap,
        initial,
        animate,
        exit,
        transition,
        ...validProps
      } = props;
      return React.createElement('div', { className, onClick, ...validProps }, children);
    },
  },
  AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
  useMotionValue: () => ({ get: () => 0, set: () => {} }),
  useTransform: () => 0,
}));
