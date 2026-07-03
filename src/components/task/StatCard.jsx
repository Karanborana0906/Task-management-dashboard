import React from 'react';
import { Card } from '../common';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary',
  trend,
  className = '' 
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-100 dark:bg-primary-950/50',
      text: 'text-primary-600 dark:text-primary-400',
    },
    success: {
      bg: 'bg-success-100 dark:bg-success-950/50',
      text: 'text-success-600 dark:text-success-400',
    },
    warning: {
      bg: 'bg-warning-100 dark:bg-warning-950/50',
      text: 'text-warning-600 dark:text-warning-400',
    },
    danger: {
      bg: 'bg-danger-100 dark:bg-danger-950/50',
      text: 'text-danger-600 dark:text-danger-400',
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <Card className={`p-6 sm:p-8 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-semibold text-neutral-500 dark:text-neutral-400 mb-1 truncate">{title}</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50 leading-none">{value}</p>
          {trend && (
            <p className={`text-xs sm:text-sm mt-3 ${trend.positive ? 'text-success-600' : 'text-danger-600'} font-medium`}>
              {trend.positive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className={`w-14 h-14 sm:w-16 sm:h-16 ${colors.bg} rounded-2xl flex items-center justify-center flex-shrink-0 ml-4 sm:ml-6`}>
          {Icon && <Icon className={`text-2xl sm:text-3xl ${colors.text}`} />}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
