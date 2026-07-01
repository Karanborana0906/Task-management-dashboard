import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import Select from './Select';
import Button from './Button';

const SortDropdown = ({ 
  value, 
  onChange, 
  sortOrder, 
  onSortOrderToggle,
  className = '' 
}) => {
  const sortOptions = [
    { value: 'createdAt', label: 'Newest' },
    { value: 'createdAt_asc', label: 'Oldest' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select value={value} onChange={onChange} className="flex-1">
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            Sort by: {option.label}
          </option>
        ))}
      </Select>
      <Button
        variant="secondary"
        size="sm"
        onClick={onSortOrderToggle}
        className="flex items-center gap-2"
      >
        {sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
        <span className="hidden sm:inline">{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
      </Button>
    </div>
  );
};

export default SortDropdown;
