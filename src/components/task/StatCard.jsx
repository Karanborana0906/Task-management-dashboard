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
      bg: 'bg-primary-100',
      text: 'text-primary-600',
    },
    success: {
      bg: 'bg-success-100',
      text: 'text-success-600',
    },
    warning: {
      bg: 'bg-warning-100',
      text: 'text-warning-600',
    },
    danger: {
      bg: 'bg-danger-100',
      text: 'text-danger-600',
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-1 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{value}</p>
          {trend && (
            <p className={`text-xs sm:text-sm mt-2 ${trend.positive ? 'text-success-600' : 'text-danger-600'}`}>
              {trend.positive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 ml-3 sm:ml-4`}>
          {Icon && <Icon className={`text-xl sm:text-2xl ${colors.text}`} />}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
