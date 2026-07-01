import React from 'react';

const Input = ({ 
  error = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'input';
  const errorClasses = error ? 'input-error' : '';
  const classes = [baseClasses, errorClasses, className].filter(Boolean).join(' ');
  
  return (
    <input
      className={classes}
      {...props}
    />
  );
};

export default Input;
