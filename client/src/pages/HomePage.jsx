import React, { useState } from 'react';
import { Plus, Settings, Sparkles, Filter } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import SearchBar from '../components/SearchBar';
import DayStrip from '../components/DayStrip';
import SummaryCards from '../components/SummaryCards';
import WeeklyProgressBar from '../components/WeeklyProgressBar';
import TaskCard from '../components/TaskCard';
import WeekCard from '../components/WeekCard';
import EmptyState from '../components/EmptyState';
import { TaskSkeleton, SummaryCardsSkeleton, WeekCardSkeleton } from '../components/SkeletonLoaders';
import { isSameDay, startOfWeek } from 'date-fns';

export const HomePage = () => {
  const {
    tasks,
    weeklySummaries,
    selectedDate,
    setSelectedDate,
    filterPriority,
    setFilterPriority,
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

  // Filter tasks for the selected date on the day strip
  const tasksForSelectedDate = tasks.filter((t) =>
    selectedDate ? isSameDay(new Date(t.dueAt), selectedDate) : true
  );

  // Calculate current week metrics for SummaryCards
  const currentWeekMonday = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
  const currentWeekSummary = weeklySummaries.find((w) => w.weekStart.startsWith(currentWeekMonday.slice(0, 10))) || {
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

  return (
    <div className="relative flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 shadow-2xl sm:my-6 sm:rounded-3xl border border-slate-100 overflow-hidden pb-24">
      {/* Top Header & Search Bar matching Figma Screen 2 */}
      <div className="bg-white px-5 pt-4 pb-3 border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1">
            <SearchBar
              onClick={() => setActiveView('search')}
              readOnly
              placeholder="Search for a task"
            />
          </div>

          <button
            type="button"
            onClick={() => setActiveView('onboarding')}
            aria-label="View Onboarding"
            title="App Info / Onboarding"
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Day Strip (Matching Figma Screen 2) */}
        <DayStrip
          selectedDate={selectedDate}
          onSelectDate={(d) => {
            setSelectedDate(d);
            setViewMode('day');
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="px-5 py-3 flex-1 overflow-y-auto">
        {/* Metric Cards (Task Complete & Task Pending) */}
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
        <WeeklyProgressBar
          completed={completedCount}
          total={totalCount}
        />

        {/* Priority Filter Bar */}
        <div className="flex items-center justify-between my-3 overflow-x-auto no-scrollbar gap-2 py-1">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Priority:
            </span>
          </div>
          <div className="flex items-center gap-1">
            {['All', 'High', 'Medium', 'Low'].map((p) => {
              const active = filterPriority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilterPriority(p)}
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
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

        {/* Section Header: Tasks Today / Weekly Tasks + View All toggle */}
        <div className="flex items-center justify-between mt-4 mb-3">
          <h2 className="text-base font-bold text-slate-900">
            {viewMode === 'day' ? 'Tasks Today' : 'All Weeks Overview'}
          </h2>
          <button
            type="button"
            onClick={() => setViewMode((m) => (m === 'day' ? 'weeks' : 'day'))}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            {viewMode === 'day' ? 'View All Weeks' : 'Show Today'}
          </button>
        </div>

        {/* View Mode 1: Day View (Tasks Today matching Figma) */}
        {viewMode === 'day' && (
          <div>
            {isLoadingTasks ? (
              <div className="space-y-2">
                <TaskSkeleton />
                <TaskSkeleton />
                <TaskSkeleton />
              </div>
            ) : tasksForSelectedDate.length === 0 ? (
              <EmptyState
                type="tasks"
                title="No tasks for this day"
                description="Enjoy your free time or schedule a new task for today using the button below."
                onAction={openCreateModal}
                actionText="Add Task"
              />
            ) : (
              <div className="space-y-1">
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
        )}

        {/* View Mode 2: All Weeks Accordion (Mon-Sun cards as per requirements) */}
        {viewMode === 'weeks' && (
          <div>
            {isLoadingSummary ? (
              <div className="space-y-3">
                <WeekCardSkeleton />
                <WeekCardSkeleton />
                <WeekCardSkeleton />
              </div>
            ) : weeklySummaries.length === 0 ? (
              <EmptyState
                type="tasks"
                title="No weekly data available"
                description="Add tasks to see weekly summaries and breakdowns."
                onAction={openCreateModal}
                actionText="Add Task"
              />
            ) : (
              <div className="space-y-3">
                {weeklySummaries.map((week) => {
                  const weekStart = new Date(week.weekStart);
                  const weekEnd = new Date(week.weekEnd);
                  // Find all tasks belonging to this week
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
        )}
      </div>

      {/* Floating Action Button (FAB) at Bottom Center (Matching Figma Screen 2) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
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

