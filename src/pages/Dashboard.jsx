import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiList,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/task/StatCard";
import TaskList from "../components/task/TaskList";
import { useAuth } from "../context/AuthContext";
import taskApi from "../services/taskApi";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskApi.getTasks();

      console.log("TASK RESPONSE:", response.data);

      setTasks(response.data.data || response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: FiList,
      color: "primary",
    },
    { title: "Pending", value: tasks.filter((t) => t.status === "Pending").length, icon: FiClock, color: "warning" },
    { title: "In Progress", value: tasks.filter((t) => t.status === "In Progress").length, icon: FiCalendar, color: "primary" },
    { title: "Completed", value: tasks.filter((t) => t.status === "Completed").length, icon: FiCheckCircle, color: "success" },
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

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {user?.name}!
              </h1>
              <p>{currentDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;