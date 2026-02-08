# Phase 5: Task Breakdown

## Completed Tasks ✅

### Infrastructure Setup
- [x] Create RedPanda Cloud account
- [x] Setup Kafka cluster and topics
- [x] Generate SASL credentials
- [x] Install Dapr CLI locally
- [x] Configure Dapr components

### Docker Configuration
- [x] Create backend Dockerfile (`api/Dockerfile`)
- [x] Create frontend Dockerfile (`web-app/Dockerfile`)
- [x] Create `docker-compose.yml`
- [x] Configure environment variables
- [x] Setup Dapr sidecar in compose

### Event-Driven Integration
- [x] Add Dapr client to FastAPI
- [x] Implement event publishing on task create
- [x] Implement event publishing on task update
- [x] Implement event publishing on task delete
- [x] Create event subscription endpoints

### Docker Hub Deployment
- [x] Build backend image: `ibuboy/todo-backend:phase5`
- [x] Build frontend image: `ibuboy/todo-frontend:phase5`
- [x] Push images to Docker Hub
- [x] Test with `docker-compose pull`

### Documentation
- [x] Update README.md
- [x] Create Phase 5 specs
- [x] Update .gitignore
- [x] Create video script

---

## Pending Tasks ⏳

### Demo Video
- [ ] Test all demo steps
- [ ] Record 90-120 second video
- [ ] Upload to YouTube
- [ ] Get shareable link

### Submission
- [ ] Fill hackathon form
- [ ] Submit GitHub URL
- [ ] Submit YouTube link
- [ ] Submit Docker Hub links

---

## Task Details

### T1: RedPanda Cloud Setup
**Status**: ✅ Complete
**Details**:
- Created cluster on RedPanda Cloud
- Topics: `task-events`, `notifications`
- SASL authentication configured

### T2: Dapr Components
**Status**: ✅ Complete
**Files**:
- `dapr/components/pubsub.yaml`
- `dapr/components/statestore.yaml`

### T3: Dockerfiles
**Status**: ✅ Complete
**Backend** (`api/Dockerfile`):
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend** (`web-app/Dockerfile`):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### T4: Docker Compose
**Status**: ✅ Complete
**Services**:
1. `todo-frontend` (Port 3000)
2. `todo-backend` (Port 8000)
3. `todo-backend-dapr` (Port 3500)

### T5: Event Publishing
**Status**: ✅ Complete
**Events**:
- `task.created` → on POST /api/tasks
- `task.updated` → on PUT /api/tasks/{id}
- `task.deleted` → on DELETE /api/tasks/{id}
- `task.completed` → on task completion

### T6: Demo Video
**Status**: ⏳ Pending
**Script**: See `README.md`
**Duration**: 90-120 seconds
**Content**:
1. Introduction (15s)
2. Docker demo (20s)
3. AI chatbot (25s)
4. Advanced features (30s)
5. Event architecture (15s)
6. Conclusion (15s)

---

## Commands Reference

### Start Services
```powershell
docker-compose up -d
```

### Check Status
```powershell
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### View Logs
```powershell
docker-compose logs -f
```

### Stop Services
```powershell
docker-compose down
```

### Rebuild Images
```powershell
docker-compose build --no-cache
docker-compose up -d
```
