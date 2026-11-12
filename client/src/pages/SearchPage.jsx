import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { TaskSkeleton } from '../components/SkeletonLoaders';
import useDebounce from '../hooks/useDebounce';
import taskApi from '../api/taskApi';

export const SearchPage = ({
  onBack,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(searchTerm, 300);

  useEffect(() => {
    const doSearch = async () => {
      const q = debouncedQuery.trim();
      if (!q) {
        setResults([]);
        setIsSearching(false);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      try {
        const res = await taskApi.searchTasks(q);
        if (res.success) {
          setResults(res.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    };

    doSearch();
  }, [debouncedQuery]);

  // Status toggle handler in search results
  const handleToggle = async (taskId) => {
    // Local optimistic update
    setResults((prev) =>
      prev.map((t) =>
        t._id === taskId
          ? {
              ...t,
              status: t.status === 'Completed' ? 'In Progress' : 'Completed',
            }
          : t
      )
    );
    await onToggleStatus(taskId);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 shadow-2xl sm:my-6 sm:rounded-3xl border border-slate-100 overflow-hidden">
      {/* Top Search Header matching Figma Screen 4 */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search for a task..."
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Results Container */}
      <div className="p-4 flex-1 overflow-y-auto">
        {isSearching ? (
          <div className="space-y-2.5 pt-2">
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
          </div>
        ) : hasSearched && results.length === 0 ? (
          <EmptyState
            type="search"
            title="No matching tasks"
            description={`No tasks found matching "${searchTerm}". Try checking your spelling or using different keywords.`}
          />
        ) : !hasSearched && !searchTerm ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-xs">Type a keyword above to search through your tasks</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
              Found {results.length} {results.length === 1 ? 'task' : 'tasks'}
            </p>
            {results.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleStatus={handleToggle}
                onEdit={onEdit}
                onDelete={() => onDelete(task)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

