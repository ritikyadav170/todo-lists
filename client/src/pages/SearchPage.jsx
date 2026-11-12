import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Responsive Header */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to dashboard"
            className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search across titles and descriptions..."
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Results Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">
        {isSearching ? (
          <div className="space-y-3 pt-2">
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
            <EmptyState
              type="search"
              title="No matching tasks found"
              description={`We couldn't find any tasks matching "${searchTerm}". Try checking your spelling or using different keywords.`}
            />
          </div>
        ) : !hasSearched && !searchTerm ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
              <Search className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Search Your Tasks
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Type keywords above to search across all your upcoming, in-progress, and completed tasks.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Search Results ({results.length})
              </p>
              <span className="text-xs text-slate-500 font-medium">
                Matching "{searchTerm}"
              </span>
            </div>

            <div className="space-y-2.5">
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
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
