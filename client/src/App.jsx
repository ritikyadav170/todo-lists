import React from 'react';
import { Toaster } from 'react-hot-toast';
import { TaskProvider, useTasks } from './context/TaskContext';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import TaskBottomSheet from './components/TaskBottomSheet';
import ConfirmDialog from './components/ConfirmDialog';

const AppContent = () => {
  const {
    activeView,
    setActiveView,
    completeOnboarding,
    isFormOpen,
    taskToEdit,
    closeModal,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    openEditModal,
    taskToDelete,
    setTaskToDelete,
    isDeleting,
    selectedDate,
  } = useTasks();

  const handleFormSubmit = async (formData) => {
    try {
      if (taskToEdit) {
        await updateTask(taskToEdit._id, formData);
      } else {
        await createTask(formData);
      }
    } catch {
      // Handled and toasted in TaskContext
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (taskToDelete) {
        await deleteTask(taskToDelete._id);
      }
    } catch {
      // Handled and toasted in TaskContext
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-start">
      {/* View Switching */}
      {activeView === 'onboarding' && (
        <OnboardingPage onGetStarted={completeOnboarding} />
      )}

      {activeView === 'home' && (
        <HomePage />
      )}

      {activeView === 'search' && (
        <SearchPage
          onBack={() => setActiveView('home')}
          onToggleStatus={toggleTaskStatus}
          onEdit={openEditModal}
          onDelete={(task) => setTaskToDelete(task)}
        />
      )}

      {/* Slide-up Task Bottom Sheet / Drawer Modal matching Figma Screen 3 */}
      <TaskBottomSheet
        isOpen={isFormOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        initialData={taskToEdit}
        defaultDate={selectedDate}
      />

      {/* Confirmation Modal Dialog for Task Deletion */}
      <ConfirmDialog
        isOpen={!!taskToDelete}
        title="Delete Task?"
        message={
          taskToDelete
            ? `Are you sure you want to delete "${taskToDelete.title}"? This cannot be undone.`
            : 'Are you sure you want to delete this task?'
        }
        confirmText="Delete"
        cancelText="Cancel"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};

export const App = () => {
  return (
    <TaskProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            borderRadius: '1rem',
            fontSize: '13px',
            fontWeight: '500',
            padding: '10px 16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <AppContent />
    </TaskProvider>
  );
};

export default App;

