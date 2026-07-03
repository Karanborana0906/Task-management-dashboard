import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import TaskCard from './TaskCard';
import { SearchBar, FilterDropdown, SortDropdown, EmptyState, Loader, Button, Badge } from '../common';
import { useDebounce } from '../../hooks/useDebounce';

const TaskList = ({
  tasks = [],
  onEdit,
  onDelete,
  isLoading = false,
  className = ''
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (debouncedSearchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case 'createdAt':
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        case 'priority':
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [tasks, debouncedSearchQuery, filterStatus, filterPriority, sortBy, sortOrder]);

  // Total pages calculation
  const totalPages = Math.ceil(filteredAndSortedTasks.length / itemsPerPage);

  // Reset page to 1 if filter makes current page invalid
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, filterStatus, filterPriority, sortBy, sortOrder]);

  // Paginated subset of tasks
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTasks, currentPage, itemsPerPage]);

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={className}>
        <Loader text="Loading tasks..." />
      </div>
    );
  }

  // Empty state
  if (filteredAndSortedTasks.length === 0) {
    const hasFilters = searchQuery || filterStatus !== 'all' || filterPriority !== 'all';

    return (
      <div className={className}>
        <EmptyState
          icon="inbox"
          title="No tasks found"
          description={searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
            ? "Try adjusting your search or filters"
            : "You don't have any tasks yet. Create your first task to get started!"}
          actionText={searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
            ? "Clear Filters"
            : "Create Task"}
          onAction={() => {
            if (hasFilters) {
              setSearchQuery('');
              setFilterStatus('all');
              setFilterPriority('all');
            } else {
              navigate('/create-task');
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
        />

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status Filter */}
          <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
            <FilterDropdown
              filterType="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
            <FilterDropdown
              filterType="priority"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Sort */}
          <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
            <SortDropdown
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sortOrder={sortOrder}
              onSortOrderToggle={handleSortToggle}
              className="w-full"
            />
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || filterStatus !== 'all' || filterPriority !== 'all') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterPriority('all');
              }}
              className="flex items-center gap-2"
            >
              <FiFilter />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Task Count */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          Showing {filteredAndSortedTasks.length} task{filteredAndSortedTasks.length !== 1 ? 's' : ''}
        </span>
        {(searchQuery || filterStatus !== 'all' || filterPriority !== 'all') && (
          <Badge variant="secondary" className="text-xs">
            Filtered
          </Badge>
        )}
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTasks.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-6 mt-8 flex-col sm:flex-row gap-4">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing <span className="font-semibold text-neutral-900 dark:text-neutral-100">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedTasks.length)}</span> to{' '}
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">{Math.min(currentPage * itemsPerPage, filteredAndSortedTasks.length)}</span> of{' '}
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">{filteredAndSortedTasks.length}</span> tasks
          </div>
          <div className="inline-flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'secondary'}
                onClick={() => setCurrentPage(page)}
                className="w-9 h-9 flex items-center justify-center p-0 font-bold text-sm"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
