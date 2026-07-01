import React from 'react';
import { FiSearch } from 'react-icons/fi';
import Input from './Input';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Search tasks...',
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;
