# Todo List App

A mobile-first to-do app I built with the MERN stack. You can add tasks with a time, date and priority, mark them done, swipe to delete, search, and see how your week is going.

The UI follows a Figma design I was given, so it's meant to be used on a phone-sized screen (it still works fine on desktop).

Live demo: _add link after deploying_

## What it does

- Onboarding screen with a "Get Started" button
- Home screen with a day strip, weekly progress bar, and Complete / Pending counters
- Tasks grouped by week (Monday to Sunday), each week can be expanded or collapsed
- Add and edit tasks from a bottom sheet (title, start/end time, date, priority, description)
- Tick a task to complete it, or swipe left to delete
- Search by title or description
- UI updates instantly and rolls back with a toast if the server request fails

## Tech used

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Lucide icons, date-fns, Axios, react-hot-toast

**Backend:** Node.js, Express, MongoDB with Mongoose, express-validator, helmet, cors, express-rate-limit, morgan

**Testing:** Vitest + React Testing Library on the client, Jest + Supertest + mongodb-memory-server on the server

## Folder structure

```
todo-project/
├── client/      React app
│   └── src/
│       ├── api/          axios setup and task API calls
│       ├── components/   TaskCard, WeekCard, TaskBottomSheet, DayStrip...
│       ├── context/      TaskContext (global state)
│       ├── hooks/        useTasks, useWeeklySummary, useDebounce
│       ├── pages/        HomePage, SearchPage, OnboardingPage
│       ├── tests/
│       └── utils/
└── server/      Express API
    ├── src/
    │   ├── config/       DB connection
    │   ├── models/       Task schema
    │   ├── controllers/
    │   ├── routes/
    │   ├── middleware/   error and 404 handlers
    │   ├── validators/
    │   └── utils/        helpers and seed script
    └── tests/
```

## Running it locally

You need Node 18+ and MongoDB (local install or an Atlas connection string).

```bash
git clone https://github.com/ritikyadav170/todo-lists.git
cd todo-lists

# install dependencies
npm run install:all

# create env files
cp server/.env.example server/.env
cp client/.env.example client/.env

# optional: add some sample tasks
npm run seed

# start client and server together
npm run dev
```

The client runs on http://localhost:5173 and the API on http://localhost:5000.

### Environment variables

`server/.env`

| Name | What it's for | Default |
| --- | --- | --- |
| PORT | Server port | 5000 |
| NODE_ENV | development / production / test | development |
| MONGODB_URI | MongoDB connection string | mongodb://127.0.0.1:27017/todo-app |
| CLIENT_URL | Frontend URL allowed by CORS | http://localhost:5173 |
| TIMEZONE | Timezone used for weekly grouping | Asia/Kolkata |

`client/.env`

| Name | What it's for | Default |
| --- | --- | --- |
| VITE_API_URL | Backend API base URL | http://localhost:5000/api |

## Tests

```bash
npm test               # everything
npm run test:server    # backend only
npm run test:client    # frontend only
```

The server tests cover CRUD, validation, search, status changes and the weekly grouping. The client tests cover WeekCard, TaskCard and the task form.

## API

All routes start with `/api` and respond in this shape:

```json
{ "success": true, "data": {}, "message": "..." }
```

| Method | Route | Description |
| --- | --- | --- |
| GET | /health | Health check |
| POST | /tasks | Create a task |
| GET | /tasks | List tasks (filters: `weekStart`, `status`, `priority`, `date`) |
| GET | /tasks/weeks | Weekly summary: open, completed and total per week |
| GET | /tasks/search?q=term | Search title and description |
| PATCH | /tasks/:id/status | Mark as `Completed` or `In Progress` |
| PATCH / PUT | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |

Example request body for creating a task:

```json
{
  "title": "Finish wireframe",
  "description": "High fidelity screens for the home page",
  "dueAt": "2026-11-12T10:00:00.000Z",
  "startTime": "10:00 AM",
  "endTime": "11:30 AM",
  "priority": "High"
}
```

## Deploying

**Frontend (Netlify)**
- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `client/dist`
- Set `VITE_API_URL` to your deployed API URL
- `netlify.toml` already handles the SPA redirects

**Backend (Render or Railway)**
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Set `NODE_ENV`, `MONGODB_URI`, `CLIENT_URL` and `TIMEZONE`

## Things I'd improve next

- User accounts and login
- Reminders and notifications
- Dark mode
- Drag and drop to reorder tasks