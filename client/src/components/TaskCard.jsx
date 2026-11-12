import React from 'react';
import { Check, Edit2, Trash2 } from 'lucide-react';
import SwipeableRow from './SwipeableRow';
import PriorityBadge from './PriorityBadge';
import { formatTaskTime } from '../utils/dateHelpers';

export const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'Completed';
  const timeString = formatTaskTime(task.startTime, task.endTime, task.dueAt);

  return (
    <SwipeableRow onDelete={onDelete}>
      <div className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl shadow-card transition-all hover:border-slate-200">
        {/* Left: Custom Checkbox + Task Info */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
          {/* Custom Checkbox */}
          <button
            type="button"
            role="checkbox"
            aria-checked={isCompleted}
            onClick={() => onToggleStatus(task._id)}
            className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 flex-shrink-0 ${
              isCompleted
                ? 'bg-brand-600 border-2 border-brand-600 text-white'
                : 'border-2 border-brand-500 bg-white hover:bg-brand-50 text-transparent'
            }`}
          >
            <Check className={`w-3.5 h-3.5 stroke-[3] ${isCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} transition-all`} />
          </button>

          {/* Title & Metadata */}
          <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onEdit(task)}>
            <p
              className={`text-sm tracking-tight truncate select-none ${
                isCompleted
                  ? 'line-through text-slate-400 font-medium'
                  : 'text-slate-800 font-semibold'
              }`}
            >
              {task.title}
            </p>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {timeString && (
                <span className="text-[11px] font-medium text-slate-400">
                  {timeString}
                </span>
              )}
              {task.priority && (
                <PriorityBadge priority={task.priority} size="xs" />
              )}
            </div>
          </div>
        </div>

        {/* Right Action Icons (Matching Figma) */}
        <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400">
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete task"
            className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors focus:outline-none"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </SwipeableRow>
  );
};

export default TaskCard;

