import React from 'react';

const Card = ({ 
  children, 
  hover = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = hover ? 'card-hover' : 'card';
  const classes = [baseClasses, className].filter(Boolean).join(' ');
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
