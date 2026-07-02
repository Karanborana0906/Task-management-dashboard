import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout";
import TaskForm from "../components/task/TaskForm";
import { PageHeading, Button, Breadcrumb } from "../components/common";
import toast from "react-hot-toast";
import taskApi from "../services/taskApi";

const CreateTask = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      console.log("Creating Task:", formData);

      const response = await taskApi.createTask(formData);

      console.log("Create Task Response:", response.data);

      toast.success(response.data.message || "Task created successfully!");

      navigate("/dashboard");
    } catch (error) {
      console.error("Create Task Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to create task"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">

          <PageHeading
            title="Create Task"
            subtitle="Create a new task to track your work"
            action={
              <Button
                variant="primary"
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2"
              >
                <FiPlus />
                <span>View All Tasks</span>
              </Button>
            }
          />

          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Create Task" },
            ]}
            className="mb-6"
          />

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