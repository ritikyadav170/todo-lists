import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title = 'Delete Task?',
  message = 'Are you sure you want to delete this task? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isConfirming = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl z-10"
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              {title}
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              {message}
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onCancel}
                disabled={isConfirming}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isConfirming}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-600/20 transition-all flex items-center gap-1.5 disabled:opacity-70"
              >
                {isConfirming && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{confirmText}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;

