# Campus Lost & Found

**Find what you lost. Return what you found.**

A MERN-stack web application for a college campus where students, faculty and owners can report, search, manage and resolve lost and found items.

## Features

- Register / Login with role selection (Student, Faculty, Owner), JWT authentication, bcrypt password hashing
- Protected routes (Dashboard, Add Item) that redirect to Login
- Report Lost or Found items (title, description, category, location, date, contact)
- Browse active items with search (title / description / location) and filters (All / Lost / Found / Category)
- Item details page (contact info is shown to logged-in users only)
- Dashboard with total / active / resolved counts and your own posts
- Mark as Resolved and Delete, allowed **only for the post's owner** (checked on the backend)
- Responsive UI (desktop, tablet, mobile), loading states, empty states, error messages, 404 page

## Technology Stack

| Part | Technology |
|------|-----------|
| Frontend | React 18, Vite, React Router, Axios, CSS |
| Backend | Node.js, Express.js (REST API) |
| Database | MongoDB with Mongoose |
| Auth | JWT, bcryptjs |

## Project Structure

```
campus-lost-found-final/
├── backend/
│   ├── config/db.js
│   ├── controllers/  (authController.js, itemController.js)
│   ├── middleware/   (authMiddleware.js)
│   ├── models/       (User.js, Item.js)
│   ├── routes/       (authRoutes.js, itemRoutes.js)
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  (Navbar, ItemCard, ProtectedRoute, ErrorBoundary)
│   │   ├── context/     (AuthContext.jsx)
│   │   ├── pages/       (Home, Register, Login, Dashboard, Items, AddItem, ItemDetails, NotFound)
│   │   ├── api.js, constants.js, App.jsx, App.css, main.jsx
│   ├── .env.example
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## Requirements

- Node.js 18 or newer (https://nodejs.org)
- MongoDB Community Server (https://www.mongodb.com/try/download/community) — must be **running**
- MongoDB Compass (optional, to view data)

## MongoDB Setup (Windows)

1. Install MongoDB Community Server. Keep the option "Install MongoDB as a Service" ticked.
2. Check it is running: open *Services* (`Win + R` → `services.msc`) and make sure **MongoDB Server** is "Running".
3. The default address is `mongodb://127.0.0.1:27017`. The database `campusLostFound` is created automatically on first use.
4. In MongoDB Compass, connect to `mongodb://127.0.0.1:27017` to browse the data.

## Backend Setup

Open Command Prompt (CMD) in the project folder:

```
cd backend
npm install
copy .env.example .env
npm run dev
```

Then open `backend\.env` and replace `JWT_SECRET` with a long random string. The backend runs on http://localhost:5000. You should see:

```
MongoDB connected: 127.0.0.1/campusLostFound
Server running on http://localhost:5000
```

## Frontend Setup

Open a **second** CMD window in the project folder:

```
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend runs on http://localhost:5173 — open it in your browser.

## How to Run (summary)

1. Start MongoDB Server (service).
2. Terminal 1: `cd backend` → `npm run dev`
3. Terminal 2: `cd frontend` → `npm run dev`
4. Visit http://localhost:5173

## Test Account Instructions

There are no pre-made accounts (no fake data is shipped). To test:

1. Click **Register**, create an account (e.g. `student1@test.com`, password `123456`, role Student).
2. Click **Add Item** and post a Lost item and a Found item.
3. Register a second account in another browser / private window (e.g. `faculty1@test.com`) and confirm it can see the first user's posts but cannot delete or resolve them (those buttons appear only for the owner, and the API returns 403).

## API Overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register (name, email, password, confirmPassword, role) |
| POST | `/auth/login` | No | Login, returns JWT + user |
| GET | `/auth/me` | Yes | Current logged-in user |
| GET | `/items` | Optional | Active items. Query: `search`, `type` (Lost/Found), `category` |
| POST | `/items` | Yes | Create an item |
| GET | `/items/my` | Yes | Items posted by the logged-in user |
| GET | `/items/:id` | Optional | Single item (contact only for logged-in users) |
| PATCH | `/items/:id/resolve` | Yes (owner) | Mark as Resolved |
| DELETE | `/items/:id` | Yes (owner) | Delete item |

Authenticated requests send `Authorization: Bearer <token>`.

## GitHub Upload Instructions

```
git init
git add .
git commit -m "Initial commit: Campus Lost & Found"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/campus-lost-found.git
git push -u origin main
```

The `.gitignore` files already exclude `node_modules`, `.env` and `dist`. Never commit a real `.env` file.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Could not connect to MongoDB` | Start the MongoDB Server service; check `MONGO_URI` in `backend\.env`. |
| `JWT_SECRET is not set` | You forgot `copy .env.example .env` in `backend`. |
| "Cannot reach the server" in the browser | Backend is not running, or is not on port 5000. |
| CORS error | Frontend must run on http://localhost:5173 (backend allows only this origin). |
| `Port 5000 already in use` | Change `PORT` in `backend\.env` and `VITE_API_URL` in `frontend\.env`, then restart both. |
| Changed `.env` but nothing changed | Restart the dev server (`Ctrl + C`, then `npm run dev`). |
| `npm` is not recognized | Install Node.js and reopen CMD. |

## Role-based access

The application provides separate role-based login and dashboards:

- **Student:** Student Dashboard for reporting lost/found items, browsing/searching items, and managing the student's own reports.
- **Faculty:** Faculty Dashboard for reviewing campus reports and resolving active reports created by students.
- **Owner:** Owner Dashboard for complete system maintenance, including user management and all item management.

The Login page uses three separate role tabs: **Student**, **Faculty**, and **Owner**. The selected tab determines the login type, while the backend verifies that the account's stored role matches the selected role.

### Role permissions

| Feature | Student | Faculty | Owner |
|---|---|---|---|
| Login | Yes | Yes | Yes |
| Browse/search items | Yes | Yes | Yes |
| Report lost/found item | Yes | Yes | Yes |
| Manage own reports | Yes | Yes | Yes |
| Resolve own report | Yes | Yes | Yes |
| Resolve student reports | No | Yes | Yes |
| Manage all items | No | View/resolve student reports | Yes |
| Manage users | No | No | Yes |
| Delete other users' items | No | No | Yes |

Role permissions are enforced on the backend using JWT authentication and role middleware; hiding a button in the frontend is not the security mechanism.
