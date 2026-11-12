import React from 'react';
import { Check, Clock } from 'lucide-react';

export const SummaryCards = ({ completedCount = 0, pendingCount = 0, label = 'This Week' }) => {
  // Format numbers with leading zero if single digit (e.g. "08" as in Figma)
  const formatNumber = (num) => {
    return num < 10 && num >= 0 ? `0${num}` : `${num}`;
  };

  return (
    <div className="grid grid-cols-2 gap-3.5 my-3">
      {/* Completed Tasks Card */}
      <div className="bg-[#EEF4FF] border border-[#DCE7FF] rounded-2xl p-4 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.01]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-[#D4E4FF] flex items-center justify-center text-brand-600">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xs font-semibold text-slate-600">Task Complete</span>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatNumber(completedCount)}
          </span>
          <span className="text-[11px] font-medium text-slate-400">{label}</span>
        </div>
      </div>

      {/* Pending Tasks Card */}
      <div className="bg-[#FFF0F2] border border-[#FFE2E5] rounded-2xl p-4 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.01]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFE0E4] flex items-center justify-center text-rose-500">
            <Clock className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xs font-semibold text-slate-600">Task Pending</span>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatNumber(pendingCount)}
          </span>
          <span className="text-[11px] font-medium text-slate-400">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;

