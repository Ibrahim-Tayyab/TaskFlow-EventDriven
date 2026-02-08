# 🚀 Master Startup Cheat Sheet: Todo App (Phase 4)

**Save this file.** This is your all-in-one guide to running, debugging, and fixing the application after a PC restart.

---

## 1️⃣ daily Startup Sequence (The "Happy Path")
*Run these commands in order when you turn on your PC.*

### 🟢 Step A: Wake up the Cluster
Open **Terminal 1** and run:
```powershell
minikube start
```
*Wait until it says "Done".*

### 🟢 Step B: Check Status
Verify that your "computers" (Pods) are running:
```powershell
kubectl get pods
```
*You should see `todo-backend...` and `todo-frontend...` with Status: `Running`.*

### 🟢 Step C: Open Connections (Port Forwarding)
You need to open **TWO separate terminals** to keep the connections alive.

**Terminal 2 (Backend Tunnel):**
```powershell
kubectl port-forward svc/todo-backend 8000:8000
```

**Terminal 3 (Frontend Tunnel):**
```powershell
kubectl port-forward svc/todo-frontend 3000:3000
```

**✅ Result:**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend Limit: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

---

## 2️⃣ Monitoring & Logs (The "Detective Work")
*Use these commands if something isn't working or you want to see what's happening.*

### 📜 See Backend Logs (Python/FastAPI)
See what the backend is doing (Database queries, Errors, Login requests):
```powershell
# Live logs (Ctrl+C to stop watching)
kubectl logs -l app=todo-backend -f
```

### 📜 See Frontend Logs (Next.js)
See server-side errors or rewrite logs:
```powershell
# Live logs
kubectl logs -l app=todo-frontend -f
```

### 📜 See Database Logs (Postgres)
If you suspect database connection issues:
```powershell
kubectl logs -l app=postgres -f
```

---

## 3️⃣ Troubleshooting & Fixes (The "Mechanic's Kit")

### 🔧 Fix "Port Already in Use" Error
If `port-forward` says port 3000 or 8000 is busy:
**Option A: Find and kill the process**
1. Find the ID: `netstat -ano | findstr :3000`
2. Kill it: `taskkill /PID <PID> /F`

**Option B (Lazy Fix): Use a different port**
```powershell
# Map PC port 3001 -> App port 3000
kubectl port-forward svc/todo-frontend 3001:3000
# Then open http://localhost:3001
```

### 🔧 Fix "Pod Stuck or Not Updating"
If the app is acting weird, turn it off and on again:
```powershell
# Restart Backend
kubectl rollout restart deployment todo-backend

# Restart Frontend
kubectl rollout restart deployment todo-frontend
```

---

## 4️⃣ Development Commands (Making Changes)

### 🏗️ Rebuild & Push New Code
If you change the code, you must rebuild the image and tell Minikube about it.

**For Backend Changes:**
```powershell
# 1. Build new image
docker build -t todo-backend:latest ./api

# 2. Upload to Minikube
minikube image load todo-backend:latest

# 3. Restart Pod
kubectl rollout restart deployment todo-backend
```

**For Frontend Changes:**
```powershell
# 1. Build new image
docker build -t todo-frontend:fixed2 ./web-app

# 2. Upload to Minikube
minikube image load todo-frontend:fixed2

# 3. Restart Pod
kubectl rollout restart deployment todo-frontend
```

---

## 5️⃣ Backup Commands (Safety Net)

### 💾 Save Everything to Docker Hub
```powershell
docker login
docker push <YOUR_USERNAME>/todo-backend:phase4
docker push <YOUR_USERNAME>/todo-frontend:phase4
```

---
*End of Cheat Sheet*
