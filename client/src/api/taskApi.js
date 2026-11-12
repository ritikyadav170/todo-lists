import apiClient from './client';

/**
 * Task API Services
 */
export const taskApi = {
  /**
   * Fetch tasks with optional filters
   * @param {Object} params - { weekStart, status, priority, date }
   */
  async getTasks(params = {}) {
    return apiClient.get('/tasks', { params });
  },

  /**
   * Fetch weekly summaries aggregation
   * @param {string} timezone - optional IANA timezone string
   */
  async getWeeklySummary(timezone) {
    return apiClient.get('/tasks/weeks', {
      params: timezone ? { timezone } : {},
    });
  },

  /**
   * Search tasks by query string
   * @param {string} q - keyword
   */
  async searchTasks(q) {
    return apiClient.get('/tasks/search', {
      params: { q },
    });
  },

  /**
   * Get single task by ID
   * @param {string} id
   */
  async getTaskById(id) {
    return apiClient.get(`/tasks/${id}`);
  },

  /**
   * Create a new task
   * @param {Object} taskData - { title, description, dueAt, startTime, endTime, priority, status }
   */
  async createTask(taskData) {
    return apiClient.post('/tasks', taskData);
  },

  /**
   * Update task fields
   * @param {string} id
   * @param {Object} updates
   */
  async updateTask(id, updates) {
    return apiClient.patch(`/tasks/${id}`, updates);
  },

  /**
   * Update task status only
   * @param {string} id
   * @param {'Completed' | 'In Progress'} status
   */
  async updateTaskStatus(id, status) {
    return apiClient.patch(`/tasks/${id}/status`, { status });
  },

  /**
   * Delete a task
   * @param {string} id
   */
  async deleteTask(id) {
    return apiClient.delete(`/tasks/${id}`);
  },

  /**
   * Health check
   */
  async checkHealth() {
    return apiClient.get('/health');
  },
};

export default taskApi;

