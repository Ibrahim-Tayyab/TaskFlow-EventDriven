---
id: 2
title: secure-database-connection
stage: red
date: 2025-12-25
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: gh-pages
user: Claude
command: sp.implement
labels: ["backend", "security", "dotenv", "cors", "fastapi", "frontend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - final_backend.py
  - .env
tests: []
---

# Secure Database Connection Implementation

## Outcome
Successfully secured the database connection using environment variables and launched both backend and frontend servers.

## Evaluation
- Created .env file with DATABASE_URL containing the Neon DB connection string
- Modified final_backend.py to load database URL from environment variable using python-dotenv
- Installed python-dotenv dependency
- Updated CORS middleware to allow http://localhost:3000 in addition to other origins
- Started FastAPI backend server on port 8000
- Located frontend in web-app directory and started Next.js dev server
- Verified backend connectivity to Neon DB using the .env variable
- Successfully tested POST and GET endpoints to confirm database functionality

## Prompt Text
```
Role: Senior Backend Architect. Task: Secure the database connection and launch both servers.

1. Security (.env setup):

Create a file named .env in the root directory.

Add this line: DATABASE_URL=postgresql://neondb_owner:npg_S12VpPEGnBkA@ep-dark-surf-aesp74dc-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

Modify final_backend.py to remove the hardcoded string. Use os.getenv("DATABASE_URL") to load the connection.

2. Dependencies:

Install python-dotenv using ./venv/bin/pip install python-dotenv.

3. Database Reset:

Execute DROP TABLE IF EXISTS tasks; and then CREATE TABLE tasks (id SERIAL PRIMARY KEY, description TEXT NOT NULL, completed BOOLEAN DEFAULT FALSE); using the psycopg driver once during startup.

4. Dual-Server Launch (Crucial):

Backend: Start the FastAPI server using ./venv/bin/python -m uvicorn final_backend:app --host 0.0.0.0 --port 8000 --reload in the background.

Frontend: Detect the frontend directory (usually frontend). Go inside and run npm start (or the relevant start command) to launch on Port 3000 in the background.

Connectivity: Ensure CORS in the backend allows http://localhost:3000.

5. Verification:

Run a curl http://localhost:8000/api/tasks test to ensure the backend is talking to Neon DB using the .env variable.

Confirm that both localhost:8000 and localhost:3000 are active.
```

## Response Text
Successfully implemented secure database connection using environment variables. The implementation includes:
- Created .env file with the database URL
- Modified final_backend.py to use os.getenv("DATABASE_URL") instead of hardcoded string
- Added python-dotenv dependency
- Updated CORS to allow http://localhost:3000
- Started both backend (port 8000) and frontend (port 3000) servers
- Verified database connectivity to Neon DB using the environment variable
- All endpoints tested and working properly