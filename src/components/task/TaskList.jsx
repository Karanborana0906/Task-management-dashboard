import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import TaskCard from './TaskCard';
import { SearchBar, FilterDropdown, SortDropdown, EmptyState, Loader, Button, Badge } from '../common';

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

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [tasks, searchQuery, filterStatus, filterPriority, sortBy, sortOrder]);

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
          description={hasFilters 
            ? "Try adjusting your search or filters" 
            : "You don't have any tasks yet. Create your first task to get started!"}
          actionText={hasFilters 
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
        <span className="text-sm text-neutral-600">
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
        {filteredAndSortedTasks.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
