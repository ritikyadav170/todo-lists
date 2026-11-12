require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const { connectDB, disconnectDB } = require('../config/db');
const { startOfWeek, addDays, subDays } = require('date-fns');

const seedTasks = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing tasks...');
    await Task.deleteMany({});

    const now = new Date();
    // Monday of current week
    const currentMonday = startOfWeek(now, { weekStartsOn: 1 });
    const prevMonday = subDays(currentMonday, 7);
    const nextMonday = addDays(currentMonday, 7);

    const makeDate = (baseMonday, dayOffset, hours, minutes) => {
      const d = addDays(baseMonday, dayOffset);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    const tasks = [
      // --- Current Week Tasks (matching Figma) ---
      {
        title: 'Finishing Wireframe',
        description: 'Complete high-fidelity mobile wireframes for client sign-off',
        dueAt: makeDate(currentMonday, 0, 10, 0), // Mon 10:00 AM
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        priority: 'High',
        status: 'In Progress',
      },
      {
        title: 'Meeting with team',
        description: 'Weekly sprint planning and sync-up with engineering and design team',
        dueAt: makeDate(currentMonday, 1, 11, 0), // Tue 11:00 AM
        startTime: '11:00 AM',
        endTime: '12:00 PM',
        priority: 'Medium',
        status: 'In Progress',
      },
      {
        title: 'Buy a cat food',
        description: 'Pick up organic salmon cat food and treats from pet store',
        dueAt: makeDate(currentMonday, 2, 14, 0), // Wed 02:00 PM
        startTime: '02:00 PM',
        endTime: '02:30 PM',
        priority: 'Low',
        status: 'Completed',
        completedAt: makeDate(currentMonday, 2, 14, 30),
      },
      {
        title: 'Finishing daily commission',
        description: 'Deliver the commissioned digital illustration to client',
        dueAt: makeDate(currentMonday, 2, 16, 0), // Wed 04:00 PM
        startTime: '04:00 PM',
        endTime: '05:30 PM',
        priority: 'High',
        status: 'Completed',
        completedAt: makeDate(currentMonday, 2, 16, 45),
      },
      {
        title: 'Doing Homework',
        description: 'Read chapter 4 of Distributed Systems and solve problem set',
        dueAt: makeDate(currentMonday, 3, 17, 0), // Thu 05:00 PM
        startTime: '05:00 PM',
        endTime: '06:30 PM',
        priority: 'Medium',
        status: 'In Progress',
      },
      {
        title: 'Prepare demo presentation',
        description: 'Create 5 slides summarizing sprint achievements and metrics',
        dueAt: makeDate(currentMonday, 4, 15, 0), // Fri 03:00 PM
        startTime: '03:00 PM',
        endTime: '04:00 PM',
        priority: 'High',
        status: 'In Progress',
      },
      {
        title: 'Gym workout session',
        description: 'Cardio warm-up followed by upper body strength training',
        dueAt: makeDate(currentMonday, 5, 9, 0), // Sat 09:00 AM
        startTime: '09:00 AM',
        endTime: '10:15 AM',
        priority: 'Low',
        status: 'In Progress',
      },
      {
        title: 'Weekly grocery restock',
        description: 'Vegetables, milk, eggs, bread and cold brews',
        dueAt: makeDate(currentMonday, 6, 11, 0), // Sun 11:00 AM
        startTime: '11:00 AM',
        endTime: '12:30 PM',
        priority: 'Medium',
        status: 'In Progress',
      },

      // --- Previous Week Tasks ---
      {
        title: 'Design system token review',
        description: 'Audit color palettes, typography scale, and spacing constants',
        dueAt: makeDate(prevMonday, 1, 10, 0),
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        priority: 'Medium',
        status: 'Completed',
        completedAt: makeDate(prevMonday, 1, 11, 15),
      },
      {
        title: 'API endpoint schema validation',
        description: 'Implement express-validator schema checks on all endpoints',
        dueAt: makeDate(prevMonday, 2, 14, 0),
        startTime: '02:00 PM',
        endTime: '03:30 PM',
        priority: 'High',
        status: 'Completed',
        completedAt: makeDate(prevMonday, 2, 14, 0),
      },
      {
        title: 'Database index benchmark',
        description: 'Verify query performance with compound and text indexes',
        dueAt: makeDate(prevMonday, 4, 16, 0),
        startTime: '04:00 PM',
        endTime: '05:00 PM',
        priority: 'Low',
        status: 'Completed',
        completedAt: makeDate(prevMonday, 4, 17, 0),
      },

      // --- Next Week Tasks ---
      {
        title: 'Frontend unit test coverage',
        description: 'Write Vitest and React Testing Library tests for WeekCard and TaskForm',
        dueAt: makeDate(nextMonday, 0, 10, 0),
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        priority: 'High',
        status: 'In Progress',
      },
      {
        title: 'Production deployment checklist',
        description: 'Verify Netlify SPA redirects and Render health check ping',
        dueAt: makeDate(nextMonday, 2, 13, 0),
        startTime: '01:00 PM',
        endTime: '02:00 PM',
        priority: 'Medium',
        status: 'In Progress',
      },
      {
        title: 'Documentation review with mentor',
        description: 'Walkthrough README instructions, architecture choices, and trade-offs',
        dueAt: makeDate(nextMonday, 3, 16, 0),
        startTime: '04:00 PM',
        endTime: '05:00 PM',
        priority: 'Low',
        status: 'In Progress',
      },
    ];

    await Task.insertMany(tasks);
    console.log(`[Seed] Successfully seeded ${tasks.length} tasks across 3 weeks!`);

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
    await disconnectDB();
    process.exit(1);
  }
};

if (require.main === module) {
  seedTasks();
}

module.exports = seedTasks;
