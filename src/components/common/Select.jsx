import React from 'react';

const Select = ({ 
  children, 
  error = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'input';
  const errorClasses = error ? 'input-error' : '';
  const classes = [baseClasses, errorClasses, className].filter(Boolean).join(' ');
  
  return (
    <select
      className={classes}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;
