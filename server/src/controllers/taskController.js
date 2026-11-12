const Task = require('../models/Task');
const { successResponse, errorResponse } = require('../utils/response');
const { escapeRegex } = require('../utils/dateUtils');

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, dueAt, startTime, endTime, priority, status } = req.body;

    const task = new Task({
      title,
      description,
      dueAt,
      startTime,
      endTime,
      priority: priority || 'Low',
      status: status || 'In Progress',
      completedAt: status === 'Completed' ? new Date() : null,
    });

    const savedTask = await task.save();
    return successResponse(res, savedTask, 'Task created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List tasks with optional filters (weekStart, status, priority, date)
 * @route   GET /api/tasks
 */
const getTasks = async (req, res, next) => {
  try {
    const { weekStart, status, priority, date } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (weekStart) {
      const start = new Date(weekStart);
      const end = new Date(start);
      // Week spans 7 days (Monday 00:00:00 to Sunday 23:59:59.999)
      end.setDate(end.getDate() + 7);
      end.setMilliseconds(end.getMilliseconds() - 1);

      filter.dueAt = {
        $gte: start,
        $lte: end,
      };
    } else if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      filter.dueAt = {
        $gte: dayStart,
        $lte: dayEnd,
      };
    }

    const tasks = await Task.find(filter).sort({ dueAt: 1, createdAt: 1 });
    return successResponse(res, tasks, 'Tasks retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get weekly summary aggregation (open, completed, total by Monday-Sunday weeks)
 * @route   GET /api/tasks/weeks
 */
const getWeeklySummary = async (req, res, next) => {
  try {
    const timezone = req.query.timezone || process.env.TIMEZONE || 'Asia/Kolkata';

    // MongoDB Aggregation using $dateTrunc (weeks starting on Monday)
    try {
      const pipeline = [
        {
          $group: {
            _id: {
              $dateTrunc: {
                date: '$dueAt',
                unit: 'week',
                binSize: 1,
                timezone: timezone,
                startOfWeek: 'monday',
              },
            },
            total: { $sum: 1 },
            completed: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0],
              },
            },
            open: {
              $sum: {
                $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            weekStart: '$_id',
            total: 1,
            completed: 1,
            open: 1,
          },
        },
        {
          $sort: { weekStart: -1 },
        },
      ];

      const rawSummaries = await Task.aggregate(pipeline);

      const summaries = rawSummaries.map((item) => {
        const start = new Date(item.weekStart);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return {
          weekStart: start.toISOString(),
          weekEnd: end.toISOString(),
          open: item.open,
          completed: item.completed,
          total: item.total,
        };
      });

      return successResponse(res, summaries, 'Weekly summary retrieved successfully');
    } catch (aggErr) {
      console.warn('[Weekly Summary] Aggregation failed, falling back to JS computation:', aggErr.message);

      // Resilient fallback in JavaScript if DB engine doesn't support $dateTrunc
      const allTasks = await Task.find({}).sort({ dueAt: -1 });
      const weeksMap = new Map();

      const { startOfWeek, endOfWeek } = require('date-fns');

      for (const t of allTasks) {
        const start = startOfWeek(t.dueAt, { weekStartsOn: 1 });
        const key = start.toISOString();
        if (!weeksMap.has(key)) {
          const end = endOfWeek(t.dueAt, { weekStartsOn: 1 });
          weeksMap.set(key, {
            weekStart: start.toISOString(),
            weekEnd: end.toISOString(),
            open: 0,
            completed: 0,
            total: 0,
          });
        }
        const week = weeksMap.get(key);
        week.total += 1;
        if (t.status === 'Completed') {
          week.completed += 1;
        } else {
          week.open += 1;
        }
      }

      const summaries = Array.from(weeksMap.values()).sort(
        (a, b) => new Date(b.weekStart) - new Date(a.weekStart)
      );

      return successResponse(res, summaries, 'Weekly summary retrieved successfully');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search tasks across title and description
 * @route   GET /api/tasks/search
 */
const searchTasks = async (req, res, next) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';

    if (!q) {
      return successResponse(res, [], 'Empty query returned no results');
    }

    const regex = new RegExp(escapeRegex(q), 'i');
    const tasks = await Task.find({
      $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
    }).sort({ dueAt: 1, createdAt: 1 });

    return successResponse(res, tasks, 'Search results retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return errorResponse(res, 'Task not found', null, 404);
    }
    return successResponse(res, task, 'Task retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update any field on a task
 * @route   PUT/PATCH /api/tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    // Maintain completedAt accurately if status changed
    if (updates.status !== undefined) {
      if (updates.status === 'Completed') {
        updates.completedAt = new Date();
      } else if (updates.status === 'In Progress') {
        updates.completedAt = null;
      }
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return errorResponse(res, 'Task not found', null, 404);
    }

    return successResponse(res, task, 'Task updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task status only
 * @route   PATCH /api/tasks/:id/status
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const updates = {
      status,
      completedAt: status === 'Completed' ? new Date() : null,
    };

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return errorResponse(res, 'Task not found', null, 404);
    }

    return successResponse(res, task, `Task marked as ${status}`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete task by ID
 * @route   DELETE /api/tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return errorResponse(res, 'Task not found', null, 404);
    }

    return successResponse(res, { id: req.params.id }, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getWeeklySummary,
  searchTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
