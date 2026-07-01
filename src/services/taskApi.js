import axiosInstance from './axios';

// Task API endpoints
const taskApi = {
  // Get all tasks with optional filters
  getTasks: (params = {}) => {
    return axiosInstance.get('/tasks', { params });
  },

  // Get a single task by ID
  getTaskById: (id) => {
    return axiosInstance.get(`/tasks/${id}`);
  },

  // Create a new task
  createTask: (taskData) => {
    return axiosInstance.post('/tasks', taskData);
  },

  // Update an existing task
  updateTask: (id, taskData) => {
    return axiosInstance.put(`/tasks/${id}`, taskData);
  },

  // Partial update of a task
  patchTask: (id, taskData) => {
    return axiosInstance.patch(`/tasks/${id}`, taskData);
  },

  // Delete a task
  deleteTask: (id) => {
    return axiosInstance.delete(`/tasks/${id}`);
  },

  // Update task status
  updateTaskStatus: (id, status) => {
    return axiosInstance.patch(`/tasks/${id}/status`, { status });
  },

  // Update task priority
  updateTaskPriority: (id, priority) => {
    return axiosInstance.patch(`/tasks/${id}/priority`, { priority });
  },

  // Get tasks by status
  getTasksByStatus: (status) => {
    return axiosInstance.get(`/tasks/status/${status}`);
  },

  // Get tasks by priority
  getTasksByPriority: (priority) => {
    return axiosInstance.get(`/tasks/priority/${priority}`);
  },

  // Search tasks
  searchTasks: (query) => {
    return axiosInstance.get('/tasks/search', { params: { q: query } });
  },

  // Get task statistics
  getTaskStats: () => {
    return axiosInstance.get('/tasks/stats');
  },

  // Bulk update tasks
  bulkUpdateTasks: (taskIds, updateData) => {
    return axiosInstance.put('/tasks/bulk', { taskIds, updateData });
  },

  // Bulk delete tasks
  bulkDeleteTasks: (taskIds) => {
    return axiosInstance.delete('/tasks/bulk', { data: { taskIds } });
  },
};

export default taskApi;
