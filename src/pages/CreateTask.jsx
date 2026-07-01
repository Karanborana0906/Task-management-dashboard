import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import TaskForm from '../components/task/TaskForm';
import { PageHeading, Button, Breadcrumb } from '../components/common';
import toast from 'react-hot-toast';

const CreateTask = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    
    // Dummy submit function
    setTimeout(() => {
      console.log('Create task submitted:', formData);
      setIsLoading(false);
      toast.success('Task created successfully!');
      navigate('/dashboard');
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <PageHeading
            title="Create Task"
            subtitle="Create a new task to track your work"
            action={
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <FiPlus />
                <span>View All Tasks</span>
              </Button>
            }
          />

          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Create Task' },
            ]}
            className="mb-6"
          />

          {/* Task Form */}
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            submitButtonText="Create Task"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateTask;
