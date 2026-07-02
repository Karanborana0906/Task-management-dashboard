import React from 'react';
import { FiEdit2, FiTrash2, FiCalendar, FiClock } from 'react-icons/fi';
import { Card, Badge, Button } from '../common';
import { formatDate, isOverdue } from '../../utils/dateUtils';

const TaskCard = ({ 
  task,
  onEdit,
  onDelete,
  className = ''
}) => {
  const {
    _id,
    title,
    description,
    priority,
    status,
    dueDate,
    createdAt,
  } = task;

  const priorityColors = {
    Low: 'secondary',
    Medium: 'warning',
    High: 'danger',
  };

  const statusColors = {
    Pending: 'secondary',
    'In Progress': 'primary',
    Completed: 'success',
  };

  const formatStatus = (s) => s;

  const taskIsOverdue = isOverdue(dueDate, status);

  return (
    <Card className={`card-hover p-6 transition-all duration-200 ${className}`}>
      {/* Header with Title and Badges */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 flex-1 leading-tight line-clamp-2">{title}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant={priorityColors[priority] || 'secondary'}>
            {priority}
          </Badge>
          <Badge variant={statusColors[status] || 'secondary'}>
            {formatStatus(status)}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <p className="text-neutral-600 text-sm mb-4 line-clamp-2 leading-relaxed">
        {description}
      </p>

      {/* Dates */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-4 text-sm">
        <div className={`flex items-center gap-2 ${taskIsOverdue ? 'text-danger-600' : 'text-neutral-500'}`}>
          <FiCalendar className="text-base flex-shrink-0" />
          <span className="truncate">Due: {formatDate(dueDate)}</span>
          {taskIsOverdue && <span className="text-danger-600 font-medium flex-shrink-0">(Overdue)</span>}
        </div>
        <div className="flex items-center gap-2 text-neutral-500">
          <FiClock className="text-base flex-shrink-0" />
          <span className="truncate">Created: {formatDate(createdAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-4 border-t border-neutral-200">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(_id)}
          className="flex-1 flex items-center justify-center gap-2 min-w-0"
        >
          <FiEdit2 className="text-sm flex-shrink-0" />
          <span className="truncate">Edit</span>
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(_id)}
          className="flex-1 flex items-center justify-center gap-2 min-w-0"
        >
          <FiTrash2 className="text-sm flex-shrink-0" />
          <span className="truncate">Delete</span>
        </Button>
      </div>
    </Card>
  );
};

export default TaskCard;
