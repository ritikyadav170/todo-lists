# 📝 Production-Ready MERN To-Do List Application (Mobile-First)

A production-quality, fully responsive, mobile-first To-Do List application built with the **MERN** stack (MongoDB, Express, React, Node.js) following modern senior engineering practices, pixel-accurate to Figma designs, featuring gesture-based interactions, optimistic UI updates, weekly calendar breakdowns, and automated test coverage.

---

## 🚀 Live Demos & Placeholders

- **Frontend Deployment (Netlify)**: `https://your-todo-app.netlify.app` *(Configured via `client/netlify.toml`)*
- **Backend API (Render / Railway)**: `https://your-todo-api.onrender.com/api`
- **Health Check Endpoint**: `https://your-todo-api.onrender.com/api/health`

---

## 🎨 Design Alignment (Pixel-Accurate to Figma)

The application faithfully implements all screens from the provided Figma specifications:

1. **Onboarding Screen (`OnboardingPage.jsx`)**
   - High-fidelity blue hero card with decorative wave patterns and circular depth accents.
   - Typography: Bold title *"Manage What To Do"*, supportive subtitle *"The best way to manage what you have to do, don't forget your plans"*.
   - Primary full-width *"Get Started"* button with smooth transition into the main application.

2. **Home Screen (`HomePage.jsx`)**
   - Rounded pill search bar with instant click-to-search activation and settings shortcut.
   - **Horizontal Day Strip (`DayStrip.jsx`)**: 8-day rolling calendar strip (*Sun 09, Mon 10, Tue 11, Wed 12, Thu 13, Fri 14, Sat 15, Sun 16*) with active blue pill highlight, white date text, and dot indicator.
   - **Summary Metrics Cards (`SummaryCards.jsx`)**:
     - *Task Complete*: Soft sky blue background (`#EEF4FF`), checkmark icon, bold counter (e.g. `50`), and `This Week` badge.
     - *Task Pending*: Soft pastel coral background (`#FFF0F2`), clock icon, bold counter (e.g. `08`), and `This Week` badge.
   - **Weekly Progress Bar (`WeeklyProgressBar.jsx`)**: Dark navy fill track reflecting live weekly task completion percentage.
   - **Weekly Accordion Overview (`WeekCard.jsx`)**: Monday–Sunday week grouping (*e.g. "10 Nov - 16 Nov"*), with Open/Completed task badges, mini progress indicators, and collapsible animated panels.
   - **Task Rows (`TaskCard.jsx` / `SwipeableRow.jsx`)**:
     - Custom rounded checkbox with smooth state toggle.
     - Completed tasks feature muted strikethrough styling.
     - Priority badges (*High, Medium, Low*) with distinct color palettes.
     - Action icons: Pencil (Edit) & Trash (Delete).
     - **Swipe-to-Delete**: Swipe left with touch or pointer drag to reveal a red delete action.
   - Centered blue **Floating Action Button (FAB)** with `+` icon.

3. **Create & Edit Task Bottom Sheet (`TaskBottomSheet.jsx`)**
   - Slides up with physics-based spring animation from the bottom.
   - Field: *Task title* (required, max 120 chars, inline validation).
   - Field: *Set Time* (side-by-side Start & Ends time inputs with clock icons).
   - Field: *Set Date* (calendar picker with formatted date).
   - Field: *Priority Selector* (Low, Medium, High pills).
   - Field: *Description* (optional textarea, max 1000 chars).
   - Primary full-width action button (*"Create task"* / *"Save changes"*) with loading spinner.

4. **Live Search View (`SearchPage.jsx`)**
   - Back navigation arrow, debounced search input (300ms) hitting `/api/tasks/search?q=`.
   - Results list with instant completion toggles, edit triggers, and swipe/fallback deletion.
   - Informative empty and no-results states.

---

## 🛠️ Tech Stack & Architecture

### **Frontend (`/client`)**
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom design system tokens
- **Animations & Gestures**: Framer Motion (swipe-to-delete, bottom sheet drawer, accordion expand/collapse)
- **Icons**: Lucide React
- **Date Handling**: `date-fns` (Monday-first week calculations, ISO string management)
- **HTTP Client**: Axios with centralized error normalization
- **Feedback**: `react-hot-toast` for optimistic rollback notifications
- **Testing**: Vitest + React Testing Library + JSDOM

### **Backend (`/server`)**
- **Runtime**: Node.js (v18+) + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Aggregation**: MongoDB `$dateTrunc` pipeline (unit: `"week"`, startOfWeek: `"monday"`, timezone configurable)
- **Validation**: `express-validator` declarative input validation middleware
- **Security**: `helmet`, `cors`, `express-rate-limit`
- **Logging**: `morgan` HTTP logger
- **Testing**: Jest + Supertest + `mongodb-memory-server`

---

## 📂 Monorepo Structure

```text
todo-project/
├── package.json             # Root monorepo scripts (dev, test, seed, build)
├── README.md                # Project documentation
├── .gitignore               # Root gitignore
│
├── server/                  # Backend Express REST API
│   ├── src/
│   │   ├── config/          # MongoDB connection & memory-server fallback
│   │   ├── models/          # Task Mongoose schema (indexes, validation)
│   │   ├── controllers/     # Task controllers (CRUD, search, aggregation)
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Centralized error handler, 404 handler
│   │   ├── validators/      # express-validator request schemas
│   │   ├── utils/           # Date helpers, standard response builders, seed script
│   │   ├── app.js           # Express app setup (security, CORS, rate limits)
│   │   └── server.js        # Server entry point with graceful shutdown
│   ├── tests/
│   │   └── task.test.js     # 19 comprehensive Jest + Supertest integration tests
│   ├── .env.example
│   └── package.json
│
└── client/                  # Frontend React + Vite SPA
    ├── src/
    │   ├── api/             # Centralized Axios client & task endpoints
    │   ├── components/      # TaskCard, WeekCard, TaskBottomSheet, DayStrip, etc.
    │   ├── context/         # TaskContext (global state, optimistic updates)
    │   ├── hooks/           # useTasks, useWeeklySummary, useDebounce
    │   ├── pages/           # HomePage, SearchPage, OnboardingPage
    │   ├── utils/           # dateHelpers, formatting utilities
    │   ├── tests/           # Vitest unit tests for components & validation
    │   ├── App.jsx          # Root view coordinator
    │   ├── main.jsx         # React DOM mount
    │   └── index.css        # Tailwind directives & custom utilities
    ├── netlify.toml         # Netlify SPA redirect & build config
    ├── tailwind.config.js   # Custom colors matching Figma
    ├── vite.config.js       # Vite configuration & proxy
    ├── .env.example
    └── package.json
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port for Express server | `5000` |
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`) | `development` |
| `MONGODB_URI` | MongoDB connection string (Local or MongoDB Atlas) | `mongodb://127.0.0.1:27017/todo-app` |
| `CLIENT_URL` | Allowed origin for CORS | `http://localhost:5173` |
| `TIMEZONE` | Timezone for weekly aggregation calculations | `Asia/Kolkata` |

### Client (`client/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL pointing to the Express `/api` endpoint | `http://localhost:5000/api` |

---

## 🏃 Quickstart & Local Setup

### 1. Clone repository
```bash
git clone <repo-url>
cd todo-project
```

### 2. Install all dependencies
```bash
npm run install:all
```
*(Or run `npm install` inside `/server` and `/client` individually).*

### 3. Configure environment files
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```
*(Optionally paste your MongoDB Atlas URI into `server/.env`).*

### 4. Seed sample data
Populate realistic tasks across multiple weeks matching the Figma design:
```bash
npm run seed
```

### 5. Start both servers concurrently
```bash
npm run dev
```
- Client runs at: `http://localhost:5173`
- Backend API runs at: `http://localhost:5000`

---

## 🧪 Running Tests

Both backend and frontend have automated test suites.

### Run all tests:
```bash
npm test
```

### Run backend tests only (Jest + Supertest):
```bash
npm run test:server
```
*Tests coverage: CRUD operations, input validation, 404 handler, case-insensitive search, status toggle transitions, and Monday-to-Sunday weekly aggregation.*

### Run frontend tests only (Vitest + React Testing Library):
```bash
npm run test:client
```
*Tests coverage: WeekCard formatting & accordion toggles, TaskBottomSheet validation, prefilled editing, and TaskCard status updates.*

---

## 📡 REST API Documentation

All routes are prefixed with `/api`. Consistent JSON response format:
`{ "success": boolean, "data": any, "message": string }`

### Endpoints:

#### 1. `GET /api/health`
Health check endpoint.
- **Response**: `200 OK`
```json
{
  "success": true,
  "status": "ok",
  "uptime": 124,
  "timestamp": "2026-11-12T13:00:00.000Z"
}
```

#### 2. `POST /api/tasks`
Create a new task.
- **Body**:
```json
{
  "title": "Finishing Wireframe",
  "description": "Design high fidelity wireframes",
  "dueAt": "2026-11-12T10:00:00.000Z",
  "startTime": "10:00 AM",
  "endTime": "11:30 AM",
  "priority": "High"
}
```
- **Response**: `201 Created`

#### 3. `GET /api/tasks`
Retrieve tasks with optional filters.
- **Query Params**:
  - `weekStart`: ISO string (e.g. `2026-11-09T00:00:00.000Z`)
  - `status`: `In Progress` | `Completed`
  - `priority`: `Low` | `Medium` | `High`
  - `date`: `YYYY-MM-DD`
- **Response**: `200 OK`

#### 4. `GET /api/tasks/weeks`
Weekly summary aggregation (Monday to Sunday) sorted by week descending.
- **Query Params**: `timezone` (optional, default `Asia/Kolkata`)
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "weekStart": "2026-11-09T00:00:00.000Z",
      "weekEnd": "2026-11-15T23:59:59.999Z",
      "open": 5,
      "completed": 3,
      "total": 8
    }
  ],
  "message": "Weekly summary retrieved successfully"
}
```

#### 5. `GET /api/tasks/search?q=:query`
Case-insensitive keyword search across title and description.
- **Response**: `200 OK`

#### 6. `PATCH /api/tasks/:id/status`
Update task status. Automatically updates or clears `completedAt`.
- **Body**: `{ "status": "Completed" }` or `{ "status": "In Progress" }`
- **Response**: `200 OK`

#### 7. `PATCH /api/tasks/:id` / `PUT /api/tasks/:id`
Update any task fields.
- **Response**: `200 OK`

#### 8. `DELETE /api/tasks/:id`
Delete task by ID.
- **Response**: `200 OK`

---

## 🚢 Deployment Checklist

### Frontend (Netlify)
1. Link your GitHub repository to Netlify.
2. Set **Base directory**: `client`
3. Set **Build command**: `npm run build`
4. Set **Publish directory**: `client/dist`
5. Under **Environment variables**, set:
   `VITE_API_URL=https://<your-render-api-url>/api`
6. `client/netlify.toml` automatically handles SPA routing redirects (`/* -> /index.html 200`).

### Backend (Render / Railway)
1. Create a **New Web Service** connected to your repository.
2. Set **Root Directory**: `server`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Set Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/todo-app?retryWrites=true&w=majority`
   - `CLIENT_URL=https://<your-netlify-app>.netlify.app`
   - `TIMEZONE=Asia/Kolkata`
