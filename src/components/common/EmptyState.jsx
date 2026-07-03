import React from 'react';
import { FiInbox, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { Button } from './index';

const EmptyState = ({ 
  icon = 'inbox',
  title = 'No data found',
  description = 'There is no data to display at the moment.',
  actionText,
  onAction,
  className = ''
}) => {
  const icons = {
    inbox: FiInbox,
    file: FiFileText,
    alert: FiAlertCircle,
  };

  const Icon = icons[icon] || FiInbox;

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
        <Icon className="text-4xl text-neutral-400 dark:text-neutral-500" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </div>
  );
};

export default EmptyState;
