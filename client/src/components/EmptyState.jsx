import React from 'react';
import { CheckSquare, Search, Plus } from 'lucide-react';

export const EmptyState = ({
  type = 'tasks',
  title,
  description,
  onAction,
  actionText = 'Add Task',
}) => {
  const isSearch = type === 'search';

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
        {isSearch ? (
          <Search className="w-7 h-7 stroke-[1.5]" />
        ) : (
          <CheckSquare className="w-7 h-7 stroke-[1.5]" />
        )}
      </div>

      <h3 className="text-base font-bold text-slate-800 mb-1">
        {title || (isSearch ? 'No tasks found' : 'All clear for now!')}
      </h3>

      <p className="text-xs text-slate-500 max-w-xs mb-5 leading-relaxed">
        {description ||
          (isSearch
            ? 'We couldn\'t find any tasks matching your search. Try searching by title or keyword.'
            : 'You don\'t have any tasks scheduled. Tap the button below to add your first task.')}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-brand-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;

