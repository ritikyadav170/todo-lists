const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Task = require('../src/models/Task');

jest.setTimeout(600000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 600000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe('Health Endpoint', () => {
  it('GET /api/health should return 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('uptime');
  });
});

describe('Task Validation & Creation', () => {
  it('POST /api/tasks creates task successfully with valid data', async () => {
    const taskData = {
      title: 'Finishing Wireframe',
      description: 'Design mobile high-fidelity wireframes',
      dueAt: new Date('2026-11-12T10:00:00.000Z').toISOString(),
      priority: 'High',
      startTime: '10:00 AM',
      endTime: '11:30 AM',
    };

    const res = await request(app).post('/api/tasks').send(taskData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(taskData.title);
    expect(res.body.data.priority).toBe('High');
    expect(res.body.data.status).toBe('In Progress');
    expect(res.body.data.completedAt).toBeNull();
  });

  it('POST /api/tasks fails when title is missing', async () => {
    const taskData = {
      dueAt: new Date().toISOString(),
    };

    const res = await request(app).post('/api/tasks').send(taskData);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'title' }),
      ])
    );
  });

  it('POST /api/tasks fails when dueAt is missing or invalid', async () => {
    const taskData = {
      title: 'Meeting with team',
      dueAt: 'not-a-valid-date',
    };

    const res = await request(app).post('/api/tasks').send(taskData);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'dueAt' }),
      ])
    );
  });

  it('POST /api/tasks fails when priority is invalid', async () => {
    const taskData = {
      title: 'Meeting with team',
      dueAt: new Date().toISOString(),
      priority: 'Urgent',
    };

    const res = await request(app).post('/api/tasks').send(taskData);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('Task Retrieval & Filtering', () => {
  beforeEach(async () => {
    await Task.create([
      {
        title: 'Task 1',
        dueAt: new Date('2026-11-10T10:00:00.000Z'),
        priority: 'Low',
        status: 'In Progress',
      },
      {
        title: 'Task 2',
        dueAt: new Date('2026-11-11T12:00:00.000Z'),
        priority: 'High',
        status: 'Completed',
        completedAt: new Date('2026-11-11T12:30:00.000Z'),
      },
      {
        title: 'Task 3',
        dueAt: new Date('2026-11-18T15:00:00.000Z'),
        priority: 'High',
        status: 'In Progress',
      },
    ]);
  });

  it('GET /api/tasks returns all tasks sorted by dueAt', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(3);
    expect(res.body.data[0].title).toBe('Task 1');
  });

  it('GET /api/tasks?status=Completed filters by status', async () => {
    const res = await request(app).get('/api/tasks?status=Completed');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Task 2');
  });

  it('GET /api/tasks?priority=High filters by priority', async () => {
    const res = await request(app).get('/api/tasks?priority=High');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it('GET /api/tasks?weekStart=... filters by week range', async () => {
    // 2026-11-09 is Monday of that week
    const res = await request(app).get('/api/tasks?weekStart=2026-11-09T00:00:00.000Z');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });
});

describe('Weekly Summary Aggregation', () => {
  beforeEach(async () => {
    await Task.create([
      // Week 1 (Monday Nov 9, 2026 to Sunday Nov 15, 2026)
      {
        title: 'Task A',
        dueAt: new Date('2026-11-09T10:00:00.000Z'),
        status: 'Completed',
      },
      {
        title: 'Task B',
        dueAt: new Date('2026-11-11T10:00:00.000Z'),
        status: 'In Progress',
      },
      // Week 2 (Monday Nov 16, 2026 to Sunday Nov 22, 2026)
      {
        title: 'Task C',
        dueAt: new Date('2026-11-17T10:00:00.000Z'),
        status: 'In Progress',
      },
    ]);
  });

  it('GET /api/tasks/weeks returns aggregated weekly breakdown', async () => {
    const res = await request(app).get('/api/tasks/weeks?timezone=UTC');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);

    const weekNov9 = res.body.data.find((w) =>
      w.weekStart.startsWith('2026-11-09')
    );
    expect(weekNov9).toBeDefined();
    expect(weekNov9.total).toBe(2);
    expect(weekNov9.completed).toBe(1);
    expect(weekNov9.open).toBe(1);
  });
});

describe('Task Search', () => {
  beforeEach(async () => {
    await Task.create([
      {
        title: 'Finishing Wireframe',
        description: 'Complete high-fidelity mobile designs',
        dueAt: new Date('2026-11-12T10:00:00.000Z'),
      },
      {
        title: 'Buy a cat food',
        description: 'Visit pet shop for food',
        dueAt: new Date('2026-11-12T14:00:00.000Z'),
      },
    ]);
  });

  it('GET /api/tasks/search?q=wireframe performs case-insensitive search', async () => {
    const res = await request(app).get('/api/tasks/search?q=wireframe');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Finishing Wireframe');
  });

  it('GET /api/tasks/search?q=pet searches inside description', async () => {
    const res = await request(app).get('/api/tasks/search?q=pet');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Buy a cat food');
  });

  it('GET /api/tasks/search with empty query returns empty array', async () => {
    const res = await request(app).get('/api/tasks/search?q=');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

describe('Task CRUD and Status Toggle', () => {
  let createdTask;

  beforeEach(async () => {
    createdTask = await Task.create({
      title: 'Initial Task',
      description: 'Initial description',
      dueAt: new Date('2026-11-12T10:00:00.000Z'),
      priority: 'Low',
      status: 'In Progress',
    });
  });

  it('GET /api/tasks/:id returns single task', async () => {
    const res = await request(app).get(`/api/tasks/${createdTask._id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Initial Task');
  });

  it('GET /api/tasks/:id with non-existent id returns 404', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/tasks/${nonExistentId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('PATCH /api/tasks/:id/status updates status to Completed and sets completedAt', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${createdTask._id}/status`)
      .send({ status: 'Completed' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Completed');
    expect(res.body.data.completedAt).not.toBeNull();
  });

  it('PATCH /api/tasks/:id/status reopens task to In Progress and clears completedAt', async () => {
    // First complete it
    await request(app)
      .patch(`/api/tasks/${createdTask._id}/status`)
      .send({ status: 'Completed' });

    // Then reopen it
    const res = await request(app)
      .patch(`/api/tasks/${createdTask._id}/status`)
      .send({ status: 'In Progress' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('In Progress');
    expect(res.body.data.completedAt).toBeNull();
  });

  it('PUT /api/tasks/:id edits task fields', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTask._id}`)
      .send({
        title: 'Updated Task Title',
        priority: 'High',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Updated Task Title');
    expect(res.body.data.priority).toBe('High');
  });

  it('DELETE /api/tasks/:id deletes task', async () => {
    const res = await request(app).delete(`/api/tasks/${createdTask._id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const checkRes = await request(app).get(`/api/tasks/${createdTask._id}`);
    expect(checkRes.status).toBe(404);
  });
});
