import React from 'react';
import { FiFilter } from 'react-icons/fi';
import Select from './Select';

const FilterDropdown = ({ 
  filterType, 
  value, 
  onChange, 
  className = '' 
}) => {
  const filterOptions = {
    status: [
      { value: 'all', label: 'All Status' },
      { value: 'todo', label: 'Pending' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
    ],
    priority: [
      { value: 'all', label: 'All Priorities' },
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' },
    ],
  };

  const options = filterOptions[filterType] || filterOptions.status;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <FiFilter className="text-neutral-400" />
      <Select value={value} onChange={onChange} className="flex-1">
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default FilterDropdown;
