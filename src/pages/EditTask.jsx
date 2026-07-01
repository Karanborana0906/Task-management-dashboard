import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import TaskForm from '../components/task/TaskForm';
import { PageHeading, Button, Loader, Breadcrumb } from '../components/common';
import toast from 'react-hot-toast';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [taskData, setTaskData] = useState(null);

  // Dummy task data (in real app, this would come from API)
  const dummyTasks = {
    1: {
      id: 1,
      title: 'Complete project proposal',
      description: 'Write and submit the project proposal document for the new client project. Include timeline, budget, and resource allocation.',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2026-07-05',
      createdAt: '2026-06-28',
    },
    2: {
      id: 2,
      title: 'Review code changes',
      description: 'Review the pull requests from the development team and provide feedback on the implementation.',
      priority: 'medium',
      status: 'todo',
      dueDate: '2026-07-03',
      createdAt: '2026-06-29',
    },
    3: {
      id: 3,
      title: 'Update documentation',
      description: 'Update the API documentation to reflect the recent changes in the authentication system.',
      priority: 'low',
      status: 'completed',
      dueDate: '2026-07-01',
      createdAt: '2026-06-25',
    },
    4: {
      id: 4,
      title: 'Team meeting preparation',
      description: 'Prepare agenda and materials for the weekly team meeting scheduled for Friday.',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2026-07-04',
      createdAt: '2026-06-30',
    },
    5: {
      id: 5,
      title: 'Fix login bug',
      description: 'Investigate and fix the reported login issue that affects users on mobile devices.',
      priority: 'high',
      status: 'todo',
      dueDate: '2026-07-02',
      createdAt: '2026-07-01',
    },
    6: {
      id: 6,
      title: 'Design new dashboard',
      description: 'Create wireframes and mockups for the new dashboard interface redesign.',
      priority: 'medium',
      status: 'todo',
      dueDate: '2026-07-10',
      createdAt: '2026-06-27',
    },
  };

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const task = dummyTasks[id];
      if (task) {
        setTaskData(task);
      } else {
        toast.error('Task not found');
        navigate('/dashboard');
      }
      setIsFetching(false);
    }, 500);
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    
    // Dummy submit function
    setTimeout(() => {
      console.log('Update task submitted:', { id, ...formData });
      setIsLoading(false);
      toast.success('Task updated successfully!');
      navigate('/dashboard');
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (isFetching) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            <Loader text="Loading task..." />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <PageHeading
            title="Edit Task"
            subtitle="Update task details and information"
            action={
              <Button
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <FiArrowLeft />
                <span>Back to Dashboard</span>
              </Button>
            }
          />

          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Tasks', href: '/dashboard' },
              { label: 'Edit Task' },
            ]}
            className="mb-6"
          />

          {/* Task Form */}
          <TaskForm
            initialData={taskData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            submitButtonText="Update Task"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default EditTask;
