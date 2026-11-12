# User Management Dashboard

A full-stack user directory for managing accounts by role. The React interface supports text search, sortable columns, and paginated results; the Express API stores users in MongoDB.

## Features

- Search users by name, user ID, email, or role
- Sort the directory by user ID, name, email, or role
- Browse results in pages, including after filtering
- Create users, edit names and roles, or remove accounts according to role
- Store passwords as bcrypt-compatible hashes
- Keep sign-in state in an HTTP-only cookie
- Enforce role access in the API instead of trusting browser storage

## Requirements

- Node.js 20 or newer
- MongoDB, running locally or available through a connection URI

## Run locally

### Configure the API

```bash
cd backend
npm install
```

Copy `.env.example` to `.env`, then set the MongoDB connection and a private JWT secret. Generate a secret with:

```bash
node -p "require('node:crypto').randomBytes(48).toString('base64')"
```

The secret must be at least 32 bytes. Add the initial administrator details to the ignored `.env` file:

```env
INITIAL_ADMIN_NAME=Your Name
INITIAL_ADMIN_EMAIL=you@example.com
INITIAL_ADMIN_PASSWORD=use-a-unique-password-of-at-least-12-characters
```

Create the first administrator once, then remove the three `INITIAL_ADMIN_*` entries from `.env`:

```bash
npm run create:admin
```

Start the API:

```bash
npm run devStart
```

The API listens on `http://localhost:1198` by default. Set `FRONTEND_ORIGINS` to the exact frontend origin if it runs elsewhere. Production cookies require HTTPS, and browser write requests must come from an allowed origin.

### Start the interface

In another terminal:

```bash
cd frontend
npm install
npm start
```

The frontend uses `http://localhost:1198/api/v1` by default. Set `REACT_APP_API_URL` before starting it to use another API address.

## Roles

| Role | Permissions |
| --- | --- |
| Administrator | View/search users, add users, edit names and roles, and delete other users |
| Editor | View/search users and edit names; cannot change roles or delete accounts |
| Viewer | View and search the directory |

## API routes

| Method | Route | Access |
| --- | --- | --- |
| `POST` | `/api/v1/login` | Public; sets the session cookie |
| `GET` | `/api/v1/session` | Signed in |
| `POST` | `/api/v1/logout` | Clears the session cookie |
| `GET` | `/api/v1/user-all` | Signed in |
| `POST` | `/api/v1/user` | Signed in; body contains an email |
| `POST` | `/api/v1/user-add` | Administrator |
| `PATCH` | `/api/v1/user-update` | Administrator or editor |
| `DELETE` | `/api/v1/user-delete/:email` | Administrator |

New passwords must be at least 12 characters and no more than 72 UTF-8 bytes. Existing bcrypt hashes remain usable.

## Screenshots

![User directory](https://github.com/a2rp/user-management-dashboard-pagination-sorting-searching/assets/5670738/5a2b81bf-c29d-4b62-b3e3-d54c301faf07)

![Search and pagination](https://github.com/a2rp/user-management-dashboard-pagination-sorting-searching/assets/5670738/4bb69fda-3cc2-4d33-be50-4250859b8829)
