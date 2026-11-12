import React from 'react';

const priorityConfig = {
  High: {
    label: 'High',
    classes: 'bg-rose-50 text-rose-600 border-rose-200',
    dot: 'bg-rose-500',
  },
  Medium: {
    label: 'Medium',
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  Low: {
    label: 'Low',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
};

export const PriorityBadge = ({ priority = 'Low', size = 'sm' }) => {
  const config = priorityConfig[priority] || priorityConfig.Low;

  const sizeClasses = size === 'xs' 
    ? 'text-[10px] px-1.5 py-0.5' 
    : 'text-xs px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.classes} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default PriorityBadge;

