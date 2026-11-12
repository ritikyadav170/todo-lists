import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, CheckCircle2, Clock } from 'lucide-react';
import TaskCard from './TaskCard';
import { formatWeekRange, isThisWeek } from '../utils/dateHelpers';

export const WeekCard = ({
  week,
  tasks = [],
  isExpanded,
  onToggle,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const currentWeek = isThisWeek(new Date(week.weekStart), { weekStartsOn: 1 });
  const rangeStr = formatWeekRange(week.weekStart, week.weekEnd);
  const percentage = week.total > 0 ? Math.round((week.completed / week.total) * 100) : 0;

  return (
    <div
      className={`border rounded-2xl transition-all duration-200 mb-3 overflow-hidden ${
        currentWeek
          ? 'border-brand-300 bg-white shadow-sm ring-1 ring-brand-500/20'
          : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
      }`}
    >
      {/* Week Header (Accordion Trigger) */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex flex-col gap-2.5 text-left focus:outline-none select-none transition-colors hover:bg-slate-50/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${currentWeek ? 'text-brand-600' : 'text-slate-400'}`} />
            <span className="font-bold text-sm text-slate-800">
              {rangeStr}
            </span>
            {currentWeek && (
              <span className="text-[10px] font-semibold bg-brand-50 text-brand-600 border border-brand-200 px-2 py-0.5 rounded-full">
                Current Week
              </span>
            )}
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-400 p-1"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Counter badges & Mini Progress */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {week.completed} Completed
            </span>
            <span className="flex items-center gap-1 font-medium text-rose-500">
              <Clock className="w-3.5 h-3.5" />
              {week.open} Open
            </span>
          </div>

          <span className="text-[11px] font-semibold text-slate-400">
            {week.total} Total ({percentage}%)
          </span>
        </div>

        {/* Micro progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-brand-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="border-t border-slate-100 bg-slate-50/50 p-3"
          >
            {tasks.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                No tasks scheduled for this week.
              </div>
            ) : (
              <div className="space-y-1">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEdit}
                    onDelete={() => onDelete(task)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeekCard;

