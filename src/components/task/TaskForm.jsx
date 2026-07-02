import React, { useState, useEffect } from 'react';
import { Input, Textarea, Select, Button, Card } from '../common';

const TaskForm = ({ 
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText = 'Save Task'
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Initialize form with data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'Medium',
        status: initialData.status || 'Pending',
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name);
  };

  const validateField = (fieldName) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'title':
        if (!formData.title.trim()) {
          newErrors.title = 'Title is required';
        } else if (formData.title.trim().length < 3) {
          newErrors.title = 'Title must be at least 3 characters';
        } else if (formData.title.trim().length > 100) {
          newErrors.title = 'Title must be less than 100 characters';
        } else {
          delete newErrors.title;
        }
        break;
      case 'description':
        if (!formData.description.trim()) {
          newErrors.description = 'Description is required';
        } else if (formData.description.trim().length < 10) {
          newErrors.description = 'Description must be at least 10 characters';
        } else if (formData.description.trim().length > 500) {
          newErrors.description = 'Description must be less than 500 characters';
        } else {
          delete newErrors.description;
        }
        break;
      case 'dueDate':
        if (!formData.dueDate) {
          newErrors.dueDate = 'Due date is required';
        } else {
          const dueDate = new Date(formData.dueDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (dueDate < today) {
            newErrors.dueDate = 'Due date cannot be in the past';
          } else {
            delete newErrors.dueDate;
          }
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit(formData);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
            Title <span className="text-danger-600">*</span>
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.title && touched.title}
            maxLength={100}
          />
          {errors.title && (
            <p className="text-danger-600 text-sm mt-1">{errors.title}</p>
          )}
          <p className="text-neutral-500 text-xs mt-1">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
            Description <span className="text-danger-600">*</span>
          </label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter task description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.description && touched.description}
            rows={4}
            maxLength={500}
          />
          {errors.description && (
            <p className="text-danger-600 text-sm mt-1">{errors.description}</p>
          )}
          <p className="text-neutral-500 text-xs mt-1">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Priority and Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-2">
              Priority
            </label>
            <Select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-2">
              Status
            </label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-2">
            Due Date <span className="text-danger-600">*</span>
          </label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.dueDate && touched.dueDate}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.dueDate && (
            <p className="text-danger-600 text-sm mt-1">{errors.dueDate}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Saving...' : submitButtonText}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TaskForm;
