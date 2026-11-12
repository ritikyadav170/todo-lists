import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const TaskBottomSheet = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  defaultDate = null,
}) => {
  const getInitialDateStr = () => {
    if (initialData?.dueAt) {
      const d = typeof initialData.dueAt === 'string' ? parseISO(initialData.dueAt) : initialData.dueAt;
      return format(d, 'yyyy-MM-dd');
    }
    const base = defaultDate ? (typeof defaultDate === 'string' ? parseISO(defaultDate) : defaultDate) : new Date();
    return format(base, 'yyyy-MM-dd');
  };

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dateStr, setDateStr] = useState(getInitialDateStr);
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00 AM');
  const [endTime, setEndTime] = useState(initialData?.endTime || '10:00 AM');
  const [priority, setPriority] = useState(initialData?.priority || 'Low');
  const [status, setStatus] = useState(initialData?.status || 'In Progress');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stable dependency for date
  const dateTimestamp = defaultDate instanceof Date ? defaultDate.toDateString() : defaultDate;

  // Sync initialData when opening for edit or new task
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      if (initialData.dueAt) {
        const d = typeof initialData.dueAt === 'string' ? parseISO(initialData.dueAt) : initialData.dueAt;
        setDateStr(format(d, 'yyyy-MM-dd'));
      }
      setStartTime(initialData.startTime || '09:00 AM');
      setEndTime(initialData.endTime || '10:00 AM');
      setPriority(initialData.priority || 'Low');
      setStatus(initialData.status || 'In Progress');
    } else {
      setTitle('');
      setDescription('');
      const base = defaultDate ? (typeof defaultDate === 'string' ? parseISO(defaultDate) : defaultDate) : new Date();
      setDateStr(format(base, 'yyyy-MM-dd'));
      setStartTime('10:00 AM');
      setEndTime('11:30 AM');
      setPriority('Low');
      setStatus('In Progress');
    }
    setErrors({});
  }, [initialData, dateTimestamp, isOpen]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Task title is required';
    } else if (title.trim().length > 120) {
      errs.title = 'Title cannot exceed 120 characters';
    }

    if (!dateStr) {
      errs.dueAt = 'Due date is required';
    }

    if (description && description.length > 1000) {
      errs.description = 'Description cannot exceed 1000 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Robust date parsing handling both YYYY-MM-DD and DD-MM-YYYY
      let dueAtDate;
      if (dateStr.includes('-')) {
        const parts = dateStr.split('-').map(Number);
        if (parts[0] > 1000) {
          // YYYY-MM-DD
          dueAtDate = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
        } else if (parts[2] > 1000) {
          // DD-MM-YYYY
          dueAtDate = new Date(parts[2], parts[1] - 1, parts[0], 12, 0, 0);
        } else {
          dueAtDate = new Date(dateStr);
        }
      } else {
        dueAtDate = new Date(dateStr);
      }

      if (isNaN(dueAtDate.getTime())) {
        dueAtDate = new Date();
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        dueAt: dueAtDate.toISOString(),
        startTime,
        endTime,
        priority,
        status,
      };

      await onSubmit(payload);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Dimmed backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-sheet overflow-hidden z-10 max-h-[92vh] flex flex-col"
          >
            {/* Top Drag indicator / Header */}
            <div className="pt-3 px-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {initialData ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              aria-label="task-form"
              onSubmit={handleSubmit}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              {/* Task title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Task title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Doing Homework"
                  maxLength={120}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.title
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Set Time (Side-by-side Start & Ends matching Figma) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Set Time
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="Start (e.g. 09:00 AM)"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      placeholder="Ends (e.g. 10:30 AM)"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Set Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Set Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                  />
                </div>
                {errors.dueAt && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.dueAt}
                  </p>
                )}
              </div>

              {/* Priority Selector (Low, Medium, High) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Medium', 'High'].map((p) => {
                    const isSelected = priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                          isSelected
                            ? p === 'High'
                              ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                              : p === 'Medium'
                              ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                              : 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add Description"
                  rows={3}
                  maxLength={1000}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all resize-none"
                />
              </div>

              {/* Status toggle for edit */}
              {initialData && (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-semibold text-slate-700">Status</span>
                  <button
                    type="button"
                    onClick={() => setStatus((s) => (s === 'Completed' ? 'In Progress' : 'Completed'))}
                    className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                      status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    }`}
                  >
                    {status}
                  </button>
                </div>
              )}

              {/* Submit Button (Matching Figma: Full width blue button) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : initialData ? (
                    'Save changes'
                  ) : (
                    'Create task'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskBottomSheet;
