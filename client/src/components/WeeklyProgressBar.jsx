import React from 'react';

export const WeeklyProgressBar = ({ completed = 0, total = 0 }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="my-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Weekly Progress
        </h3>
        <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
          {percentage}%
        </span>
      </div>

      <div className="w-full bg-[#E8EDF8] rounded-full h-3 overflow-hidden p-0.5">
        <div
          className="bg-[#1A2758] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

export default WeeklyProgressBar;

