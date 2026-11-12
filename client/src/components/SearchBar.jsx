import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  onClear,
  onClick,
  placeholder = 'Search for a task',
  autoFocus = false,
  readOnly = false,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative w-full flex items-center bg-white border border-slate-200 rounded-full px-4 py-2.5 shadow-xs transition-all hover:border-slate-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 cursor-text"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        readOnly={readOnly}
        className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none pr-8 cursor-text"
      />

      <div className="absolute right-3 flex items-center gap-1 text-slate-400">
        {value && onClear ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="p-1 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <Search className="w-4 h-4 text-slate-400" />
        )}
      </div>
    </div>
  );
};

export default SearchBar;

