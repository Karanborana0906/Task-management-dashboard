import React from 'react';
import { FiCalendar, FiCheckCircle, FiClock, FiList } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import StatCard from '../components/task/StatCard';
import TaskList from '../components/task/TaskList';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Dummy task data
  const dummyTasks = [
    {
      id: 1,
      title: 'Complete project proposal',
      description: 'Write and submit the project proposal document for the new client project. Include timeline, budget, and resource allocation.',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2026-07-05',
      createdAt: '2026-06-28',
    },
    {
      id: 2,
      title: 'Review code changes',
      description: 'Review the pull requests from the development team and provide feedback on the implementation.',
      priority: 'medium',
      status: 'todo',
      dueDate: '2026-07-03',
      createdAt: '2026-06-29',
    },
    {
      id: 3,
      title: 'Update documentation',
      description: 'Update the API documentation to reflect the recent changes in the authentication system.',
      priority: 'low',
      status: 'completed',
      dueDate: '2026-07-01',
      createdAt: '2026-06-25',
    },
    {
      id: 4,
      title: 'Team meeting preparation',
      description: 'Prepare agenda and materials for the weekly team meeting scheduled for Friday.',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2026-07-04',
      createdAt: '2026-06-30',
    },
    {
      id: 5,
      title: 'Fix login bug',
      description: 'Investigate and fix the reported login issue that affects users on mobile devices.',
      priority: 'high',
      status: 'todo',
      dueDate: '2026-07-02',
      createdAt: '2026-07-01',
    },
    {
      id: 6,
      title: 'Design new dashboard',
      description: 'Create wireframes and mockups for the new dashboard interface redesign.',
      priority: 'medium',
      status: 'todo',
      dueDate: '2026-07-10',
      createdAt: '2026-06-27',
    },
  ];

  const stats = [
    {
      title: 'Total Tasks',
      value: '24',
      icon: FiList,
      color: 'primary',
      trend: { value: 12, positive: true },
    },
    {
      title: 'Pending',
      value: '8',
      icon: FiClock,
      color: 'warning',
      trend: { value: 5, positive: false },
    },
    {
      title: 'In Progress',
      value: '6',
      icon: FiCalendar,
      color: 'primary',
      trend: { value: 8, positive: true },
    },
    {
      title: 'Completed',
      value: '10',
      icon: FiCheckCircle,
      color: 'success',
      trend: { value: 15, positive: true },
    },
  ];


  const handleEdit = (taskId) => {
    console.log('Edit task:', taskId);
    navigate(`/edit-task/${taskId}`);
  };

  const handleDelete = (taskId) => {
    console.log('Delete task:', taskId);
    // In a real app, this would call an API to delete the task
    // For now, just log it
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-sm sm:text-base text-neutral-600">{currentDate}</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Task List Section */}
          <div className="mt-8">
            <TaskList 
              tasks={dummyTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
