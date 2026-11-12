const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  getWeeklySummary,
  searchTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');

const {
  createTaskValidation,
  updateTaskValidation,
  updateStatusValidation,
} = require('../validators/taskValidator');

// Specific collection routes first
router.get('/weeks', getWeeklySummary);
router.get('/search', searchTasks);

// Root CRUD
router.route('/')
  .post(createTaskValidation, createTask)
  .get(getTasks);

// Item specific status route
router.patch('/:id/status', updateStatusValidation, updateTaskStatus);

// Item generic routes
router.route('/:id')
  .get(getTaskById)
  .put(updateTaskValidation, updateTask)
  .patch(updateTaskValidation, updateTask)
  .delete(deleteTask);

module.exports = router;
