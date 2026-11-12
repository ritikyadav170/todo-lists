import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import taskApi from '../api/taskApi';
import { startOfWeek } from 'date-fns';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [weeklySummaries, setWeeklySummaries] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null); // ISO string of weekStart
  const [selectedDate, setSelectedDate] = useState(new Date()); // Day chip selected in Figma
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState(null);

  // Bottom sheet modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Delete confirm dialog state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // View state: 'home' | 'search' | 'onboarding'
  const [activeView, setActiveView] = useState(() => {
    const hasSeenOnboarding = localStorage.getItem('todo_seen_onboarding');
    return hasSeenOnboarding ? 'home' : 'onboarding';
  });

  // Fetch weekly summary
  const fetchWeeklySummary = useCallback(async () => {
    setIsLoadingSummary(true);
    try {
      const res = await taskApi.getWeeklySummary();
      if (res.success) {
        setWeeklySummaries(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch weekly summary:', err);
    } finally {
      setIsLoadingSummary(false);
    }
  }, []);

  // Fetch tasks based on active filters
  const fetchTasks = useCallback(async () => {
    setIsLoadingTasks(true);
    setError(null);
    try {
      const params = {};
      if (selectedWeek) {
        params.weekStart = selectedWeek;
      }
      if (filterPriority && filterPriority !== 'All') {
        params.priority = filterPriority;
      }
      if (filterStatus && filterStatus !== 'All') {
        params.status = filterStatus;
      }

      const res = await taskApi.getTasks(params);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err.message || 'Failed to load tasks');
      toast.error('Could not load tasks');
    } finally {
      setIsLoadingTasks(false);
    }
  }, [selectedWeek, filterPriority, filterStatus]);

  // Initial load
  useEffect(() => {
    fetchWeeklySummary();
    fetchTasks();
  }, [fetchWeeklySummary, fetchTasks]);

  // Optimistic Toggle Task Status
  const toggleTaskStatus = async (taskId) => {
    const previousTasks = [...tasks];
    const previousSummaries = [...weeklySummaries];

    const target = tasks.find((t) => t._id === taskId);
    if (!target) return;

    const newStatus = target.status === 'Completed' ? 'In Progress' : 'Completed';

    // Optimistically update tasks list
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId
          ? {
              ...t,
              status: newStatus,
              completedAt: newStatus === 'Completed' ? new Date().toISOString() : null,
            }
          : t
      )
    );

    // Optimistically update weekly summary counters
    setWeeklySummaries((prev) =>
      prev.map((w) => {
        const taskWeek = startOfWeek(new Date(target.dueAt), { weekStartsOn: 1 }).toISOString();
        if (w.weekStart === taskWeek) {
          const deltaCompleted = newStatus === 'Completed' ? 1 : -1;
          const deltaOpen = newStatus === 'Completed' ? -1 : 1;
          return {
            ...w,
            completed: Math.max(0, w.completed + deltaCompleted),
            open: Math.max(0, w.open + deltaOpen),
          };
        }
        return w;
      })
    );

    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      toast.success(newStatus === 'Completed' ? 'Task completed!' : 'Task reopened!');
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      setWeeklySummaries(previousSummaries);
      toast.error(err.message || 'Failed to update task status');
      if (err.status === 404 || err.message?.toLowerCase().includes('not found')) {
        fetchTasks();
        fetchWeeklySummary();
      }
    }
  };

  // Create Task
  const createTask = async (taskData) => {
    try {
      const res = await taskApi.createTask(taskData);
      if (res.success) {
        // Prepend task
        setTasks((prev) => [res.data, ...prev]);
        await fetchWeeklySummary();
        toast.success('Task created successfully!');
        setIsFormOpen(false);
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create task');
      throw err;
    }
  };

  // Update Task
  const updateTask = async (taskId, updates) => {
    try {
      const res = await taskApi.updateTask(taskId, updates);
      if (res.success) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
        await fetchWeeklySummary();
        toast.success('Task updated successfully!');
        setIsFormOpen(false);
        setTaskToEdit(null);
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update task');
      // If task no longer exists on server (e.g. database was reseeded), sync list and close modal
      if (err.status === 404 || err.message?.toLowerCase().includes('not found')) {
        await fetchTasks();
        await fetchWeeklySummary();
        setIsFormOpen(false);
        setTaskToEdit(null);
      }
      throw err;
    }
  };

  // Delete Task with optimistic update & rollback
  const deleteTask = async (taskId) => {
    const previousTasks = [...tasks];
    const previousSummaries = [...weeklySummaries];

    // Optimistic removal
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    setIsDeleting(true);

    try {
      await taskApi.deleteTask(taskId);
      await fetchWeeklySummary();
      toast.success('Task deleted');
      setTaskToDelete(null);
    } catch (err) {
      setTasks(previousTasks);
      setWeeklySummaries(previousSummaries);
      toast.error(err.message || 'Failed to delete task');
      if (err.status === 404 || err.message?.toLowerCase().includes('not found')) {
        fetchTasks();
        fetchWeeklySummary();
        setTaskToDelete(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Modal helpers
  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setTaskToEdit(null);
  };

  // Complete onboarding
  const completeOnboarding = () => {
    localStorage.setItem('todo_seen_onboarding', 'true');
    setActiveView('home');
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        weeklySummaries,
        selectedWeek,
        setSelectedWeek,
        selectedDate,
        setSelectedDate,
        filterPriority,
        setFilterPriority,
        filterStatus,
        setFilterStatus,
        isLoadingTasks,
        isLoadingSummary,
        error,
        fetchTasks,
        fetchWeeklySummary,
        toggleTaskStatus,
        createTask,
        updateTask,
        deleteTask,
        isFormOpen,
        taskToEdit,
        openCreateModal,
        openEditModal,
        closeModal,
        taskToDelete,
        setTaskToDelete,
        isDeleting,
        activeView,
        setActiveView,
        completeOnboarding,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;

