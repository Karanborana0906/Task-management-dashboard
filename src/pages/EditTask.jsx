import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import taskApi from "../services/taskApi";
import TaskForm from '../components/task/TaskForm';
import { PageHeading, Button, Loader, Breadcrumb } from '../components/common';
import toast from 'react-hot-toast';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [taskData, setTaskData] = useState(null);



  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await taskApi.getTaskById(id);
        const task = response.data.data || response.data.task || response.data;
        setTaskData(task);
      } catch (error) {
        console.error('Error fetching task:', error);
        toast.error(error.response?.data?.message || 'Failed to load task');
        navigate('/dashboard');
      } finally {
        setIsFetching(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await taskApi.updateTask(id, formData);
      toast.success(response.data.message || 'Task updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Update Task Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setIsLoading(false);
    }
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
