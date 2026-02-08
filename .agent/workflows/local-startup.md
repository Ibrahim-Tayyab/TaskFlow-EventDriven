---
description: Start the Todo app locally with backend and frontend
---

# Local Startup Workflow

## Prerequisites Check

Before starting, ensure these are installed:
- Python 3.10+
- Node.js 18+
- Dapr CLI (`dapr --version`)

---

## Step 1: Kill Existing Processes (if any)

// turbo
```powershell
Get-Process | Where-Object { $_.ProcessName -match "dapr|daprd|python|node" } | Stop-Process -Force -ErrorAction SilentlyContinue
```

---

## Step 2: Start Backend (Terminal 1)

From project root folder:

```powershell
.\start_backend.ps1
```

**Wait for these success indicators:**
- `Uvicorn running on http://127.0.0.1:8000`
- `Component loaded: todo-pubsub (pubsub.kafka/v1)`
- `Application startup complete`

**Note:** Scheduler errors on port 6060 are NORMAL in standalone Dapr mode.

---

## Step 3: Start Frontend (Terminal 2)

Open a NEW terminal and run:

```powershell
cd web-app
npm run dev
```

**Wait for:**
- `Local: http://localhost:3000`

---

## Step 4: Open Browser

Navigate to: http://localhost:3000

---

## Verification Commands

### Check Dapr Status
// turbo
```powershell
Invoke-RestMethod -Uri http://localhost:3500/v1.0/metadata -Method GET | ConvertTo-Json -Depth 3
```

### Check Backend Health
// turbo
```powershell
Invoke-RestMethod -Uri http://localhost:8000/api/health -Method GET
```

### Test Kafka Publish
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3500/v1.0/publish/todo-pubsub/notifications" -Method POST -ContentType "application/json" -Body '{"message":"test"}'
```

---

## Stop Everything

```powershell
Get-Process | Where-Object { $_.ProcessName -match "dapr|daprd|python|node" } | Stop-Process -Force
```

---

## Troubleshooting

### Backend won't start
1. Check if port 3500 or 8000 is in use
2. Run kill command from Step 1
3. Retry start_backend.ps1

### Kafka connection fails
1. Check internet connection
2. Verify RedPanda Cloud is accessible
3. See `docs/REDPANDA_CONNECTION.md` for details

### Frontend errors
1. Make sure you're in `web-app` folder
2. Run `npm install` if node_modules missing
3. Check if port 3000 is free