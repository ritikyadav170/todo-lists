import React, { useState } from 'react';
import {
  Plus,
  Settings,
  Filter,
  CheckCircle2,
  Calendar as CalendarIcon,
  Layers,
  Sparkles,
  Search,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import SearchBar from '../components/SearchBar';
import DayStrip from '../components/DayStrip';
import SummaryCards from '../components/SummaryCards';
import WeeklyProgressBar from '../components/WeeklyProgressBar';
import TaskCard from '../components/TaskCard';
import WeekCard from '../components/WeekCard';
import EmptyState from '../components/EmptyState';
import { TaskSkeleton, SummaryCardsSkeleton, WeekCardSkeleton } from '../components/SkeletonLoaders';
import { isSameDay, startOfWeek, format } from 'date-fns';

export const HomePage = () => {
  const {
    tasks,
    weeklySummaries,
    selectedDate,
    setSelectedDate,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    isLoadingTasks,
    isLoadingSummary,
    toggleTaskStatus,
    openCreateModal,
    openEditModal,
    setTaskToDelete,
    setActiveView,
  } = useTasks();

  const [expandedWeekId, setExpandedWeekId] = useState(null);
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'weeks'

  // Filter tasks for selected date
  const tasksForSelectedDate = tasks.filter((t) => {
    const matchesDate = selectedDate ? isSameDay(new Date(t.dueAt), selectedDate) : true;
    return matchesDate;
  });

  // Calculate current week metrics for SummaryCards
  const currentWeekMonday = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
  const currentWeekSummary = weeklySummaries.find((w) =>
    w.weekStart.startsWith(currentWeekMonday.slice(0, 10))
  ) || {
    completed: tasks.filter((t) => t.status === 'Completed').length,
    open: tasks.filter((t) => t.status === 'In Progress').length,
    total: tasks.length,
  };

  const completedCount = currentWeekSummary.completed;
  const pendingCount = currentWeekSummary.open;
  const totalCount = currentWeekSummary.total;

  const handleToggleWeek = (weekStart) => {
    setExpandedWeekId((prev) => (prev === weekStart ? null : weekStart));
  };

  const formattedSelectedDate = selectedDate
    ? format(selectedDate, 'EEEE, dd MMMM yyyy')
    : 'All Tasks';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation Bar - Fully Responsive Web Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/25">
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Manage What To Do
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden sm:block">
                Weekly Planner & Task Management
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <SearchBar
              onClick={() => setActiveView('search')}
              readOnly
              placeholder="Search tasks, descriptions or keywords..."
            />
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Icon */}
            <button
              type="button"
              onClick={() => setActiveView('search')}
              aria-label="Search"
              className="md:hidden w-9 h-9 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Onboarding preview trigger */}
            <button
              type="button"
              onClick={() => setActiveView('onboarding')}
              aria-label="View App Guide"
              title="Welcome Screen"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Desktop Add Task CTA Button */}
            <button
              type="button"
              onClick={openCreateModal}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-500/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================= LEFT COLUMN: Overview, Stats, Calendar & Weeks ================= */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Metric Summary Cards */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Weekly Overview
                </span>
                <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  Live Sync
                </span>
              </div>

              {isLoadingSummary ? (
                <SummaryCardsSkeleton />
              ) : (
                <SummaryCards
                  completedCount={completedCount}
                  pendingCount={pendingCount}
                  label="This Week"
                />
              )}

              {/* Weekly Progress Bar */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <WeeklyProgressBar
                  completed={completedCount}
                  total={totalCount}
                />
              </div>
            </div>

            {/* Horizontal Day Calendar Strip Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-brand-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Schedule Strip
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(new Date());
                    setViewMode('day');
                  }}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Today
                </button>
              </div>

              <DayStrip
                selectedDate={selectedDate}
                onSelectDate={(d) => {
                  setSelectedDate(d);
                  setViewMode('day');
                }}
              />
            </div>

            {/* Weekly Overview Accordion Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Weekly Breakdown
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {weeklySummaries.length} weeks
                </span>
              </div>

              {isLoadingSummary ? (
                <div className="space-y-3">
                  <WeekCardSkeleton />
                  <WeekCardSkeleton />
                </div>
              ) : weeklySummaries.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No weekly records yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {weeklySummaries.map((week) => {
                    const weekStart = new Date(week.weekStart);
                    const weekEnd = new Date(week.weekEnd);
                    const weekTasks = tasks.filter((t) => {
                      const d = new Date(t.dueAt);
                      return d >= weekStart && d <= weekEnd;
                    });

                    return (
                      <WeekCard
                        key={week.weekStart}
                        week={week}
                        tasks={weekTasks}
                        isExpanded={expandedWeekId === week.weekStart}
                        onToggle={() => handleToggleWeek(week.weekStart)}
                        onToggleStatus={toggleTaskStatus}
                        onEdit={openEditModal}
                        onDelete={(t) => setTaskToDelete(t)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Tasks Today, Filters & List ================= */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {/* Main Task List Container */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs min-h-[580px] flex flex-col">
              {/* Header row with date & count */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Tasks Today
                    </h2>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {tasksForSelectedDate.length}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    {formattedSelectedDate}
                  </p>
                </div>

                {/* Status Toggle Pills (All, In Progress, Completed) */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl self-start sm:self-auto">
                  {[
                    { label: 'All', value: 'All' },
                    { label: 'In Progress', value: 'In Progress' },
                    { label: 'Completed', value: 'Completed' },
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setFilterStatus(s.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        filterStatus === s.value
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Filter Bar */}
              <div className="flex items-center justify-between py-3 overflow-x-auto no-scrollbar gap-3">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Priority:
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['All', 'High', 'Medium', 'Low'].map((p) => {
                    const active = filterPriority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFilterPriority(p)}
                        className={`text-xs px-3 py-1 rounded-full font-semibold transition-all ${
                          active
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Task Items List */}
              <div className="flex-1 pt-2">
                {isLoadingTasks ? (
                  <div className="space-y-3">
                    <TaskSkeleton />
                    <TaskSkeleton />
                    <TaskSkeleton />
                    <TaskSkeleton />
                  </div>
                ) : tasksForSelectedDate.length === 0 ? (
                  <EmptyState
                    type="tasks"
                    title="No tasks scheduled for this day"
                    description="You are all caught up for this date! Click 'Add Task' to plan a new to-do."
                    onAction={openCreateModal}
                    actionText="Create New Task"
                  />
                ) : (
                  <div className="space-y-2.5">
                    {tasksForSelectedDate.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onToggleStatus={toggleTaskStatus}
                        onEdit={openEditModal}
                        onDelete={() => setTaskToDelete(task)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile screens (Matching Figma Screen 2) */}
      <div className="sm:hidden fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={openCreateModal}
          aria-label="Add new task"
          className="w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 active:scale-95 text-white shadow-float flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-500/30"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
