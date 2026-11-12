import React from 'react';
import { Check, Edit2, Trash2, Clock, AlignLeft } from 'lucide-react';
import SwipeableRow from './SwipeableRow';
import PriorityBadge from './PriorityBadge';
import { formatTaskTime } from '../utils/dateHelpers';

export const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'Completed';
  const timeString = formatTaskTime(task.startTime, task.endTime, task.dueAt);

  return (
    <SwipeableRow onDelete={onDelete}>
      <div className="group flex items-start sm:items-center justify-between p-3.5 sm:p-4 bg-white border border-slate-200/80 hover:border-brand-300 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200">
        {/* Left: Custom Checkbox + Task Info */}
        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0 pr-3">
          {/* Custom Checkbox matching Figma */}
          <button
            type="button"
            role="checkbox"
            aria-checked={isCompleted}
            onClick={() => onToggleStatus(task._id)}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 flex-shrink-0 mt-0.5 sm:mt-0 ${
              isCompleted
                ? 'bg-brand-600 border-2 border-brand-600 text-white shadow-xs'
                : 'border-2 border-brand-500 bg-white hover:bg-brand-50 text-transparent'
            }`}
          >
            <Check
              className={`w-3.5 h-3.5 stroke-[3] transition-all duration-200 ${
                isCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            />
          </button>

          {/* Title & Metadata */}
          <div
            className="min-w-0 flex-1 cursor-pointer select-none"
            onClick={() => onEdit(task)}
          >
            <div className="flex items-baseline gap-2 flex-wrap">
              <p
                className={`text-sm sm:text-base tracking-tight transition-colors ${
                  isCompleted
                    ? 'line-through text-slate-400 font-medium'
                    : 'text-slate-800 font-semibold group-hover:text-brand-600'
                }`}
              >
                {task.title}
              </p>
            </div>

            {/* Description snippet for tablet/desktop */}
            {task.description && (
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 hidden sm:flex items-center gap-1 font-normal">
                <AlignLeft className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{task.description}</span>
              </p>
            )}

            {/* Sub-row: Time & Priority Badge */}
            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
              {timeString && (
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {timeString}
                </span>
              )}
              {task.priority && (
                <PriorityBadge priority={task.priority} size="xs" />
              )}
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 flex-shrink-0 text-slate-400 self-center">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            title="Edit task"
            className="p-2 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors focus:outline-none"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete task"
            title="Delete task"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </SwipeableRow>
  );
};

export default TaskCard;
