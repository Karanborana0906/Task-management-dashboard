import React from 'react';

const Textarea = ({ 
  error = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'input';
  const errorClasses = error ? 'input-error' : '';
  const classes = [baseClasses, errorClasses, className].filter(Boolean).join(' ');
  
  return (
    <textarea
      className={classes}
      {...props}
    />
  );
};

export default Textarea;
