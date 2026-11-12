import React from 'react';

export const TaskSkeleton = () => (
  <div className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl mb-2.5 animate-pulse">
    <div className="flex items-center gap-3.5 flex-1">
      <div className="w-6 h-6 rounded-md bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded-md w-3/4" />
        <div className="h-3 bg-slate-100 rounded-md w-1/3" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 bg-slate-200 rounded-md" />
      <div className="w-5 h-5 bg-slate-200 rounded-md" />
    </div>
  </div>
);

export const SummaryCardsSkeleton = () => (
  <div className="grid grid-cols-2 gap-3.5 my-3 animate-pulse">
    <div className="bg-slate-100 rounded-2xl p-4 h-24 flex flex-col justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-slate-200" />
        <div className="h-3 bg-slate-200 rounded w-20" />
      </div>
      <div className="h-7 bg-slate-200 rounded w-12" />
    </div>
    <div className="bg-slate-100 rounded-2xl p-4 h-24 flex flex-col justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-slate-200" />
        <div className="h-3 bg-slate-200 rounded w-20" />
      </div>
      <div className="h-7 bg-slate-200 rounded w-12" />
    </div>
  </div>
);

export const WeekCardSkeleton = () => (
  <div className="border border-slate-200 rounded-2xl p-4 bg-white mb-3 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-4 bg-slate-200 rounded w-36" />
      <div className="w-4 h-4 bg-slate-200 rounded" />
    </div>
    <div className="flex items-center gap-3 mb-2">
      <div className="h-3 bg-slate-200 rounded w-20" />
      <div className="h-3 bg-slate-200 rounded w-20" />
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full w-full" />
  </div>
);

export default {
  TaskSkeleton,
  SummaryCardsSkeleton,
  WeekCardSkeleton,
};

