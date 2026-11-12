import React from 'react';
import { isSameDay, getDayStripDates } from '../utils/dateHelpers';

export const DayStrip = ({ selectedDate, onSelectDate }) => {
  const days = getDayStripDates(selectedDate || new Date());

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center justify-between gap-2 min-w-full px-1">
        {days.map((item, idx) => {
          const isSelected = selectedDate && isSameDay(item.date, selectedDate);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDate(item.date)}
              className={`flex flex-col items-center justify-center py-2 px-2.5 min-w-[44px] rounded-2xl transition-all duration-200 focus:outline-none select-none ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 scale-105'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <span
                className={`text-[11px] font-medium leading-none mb-1.5 ${
                  isSelected ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {item.dayName}
              </span>
              <span
                className={`text-sm font-bold leading-none ${
                  isSelected ? 'text-white' : 'text-slate-700'
                }`}
              >
                {item.dayNumber}
              </span>

              {/* Dot indicator underneath as in Figma */}
              <div className="h-1.5 flex items-center justify-center mt-1">
                {isSelected ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                ) : (
                  <span className="w-1.5 h-1.5" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DayStrip;

