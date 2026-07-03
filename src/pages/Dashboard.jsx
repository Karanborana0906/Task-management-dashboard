
import { FiCalendar, FiCheckCircle, FiClock, FiList, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import StatCard from '../components/task/StatCard';
import TaskList from '../components/task/TaskList';
import StatsCharts from '../components/task/StatsCharts';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common';
import React, { useEffect, useState } from "react";
import taskApi from "../services/taskApi";


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Dummy task data
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await taskApi.getTasks({
        search: search,
      });

      setTasks(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [search]);


  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;



  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: FiList,
      color: "primary",
      trend: { value: 0, positive: true },
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: FiClock,
      color: "warning",
      trend: { value: 0, positive: false },
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: FiCalendar,
      color: "primary",
      trend: { value: 0, positive: true },
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: FiCheckCircle,
      color: "success",
      trend: { value: 0, positive: true },
    },
  ];

  const handleEdit = (taskId) => {
    navigate(`/edit-task/${taskId}`);
  };

  const handleDelete = async (taskId) => {
    try {
      await taskApi.deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm font-medium">{currentDate}</p>
            </div>
            <div>
              <Button
                variant="primary"
                onClick={() => navigate('/create-task')}
                className="flex items-center gap-2"
              >
                <FiPlus className="text-lg" />
                <span>Create Task</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Statistics Visual Charts */}
          <StatsCharts tasks={tasks} />

          {/* Task List Section */}
          <div className="mt-10">
            <TaskList
              tasks={tasks}
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