# 🚀 How to Start the Servers

## ✅ **Easy Method: Use the Startup Script**

Just double-click this file in Windows Explorer:
```
start-servers.bat
```

It will:
1. Close any existing server processes
2. Start backend on port 8000
3. Start frontend on port 3000
4. Open 2 command windows

---

## 🔧 **Manual Method**

### Option 1: From Root Folder
```powershell
# Open Terminal 1 - Backend
cd e:\Hackathon_AI\todo-hackathon\api
python -m uvicorn index:app --reload --port 8000

# Open Terminal 2 - Frontend  
cd e:\Hackathon_AI\todo-hackathon\web-app
npm run dev
```

### Option 2: Separate Terminals
```powershell
# Terminal 1 - Backend
cd api
python -m uvicorn index:app --reload --port 8000
```

```powershell
# Terminal 2 - Frontend
cd web-app
npm run dev
```

---

## ❌ **Common Errors**

### Error: "Could not import module 'index'"
**Problem:** Running from wrong directory  
**Solution:** Make sure you're in the `api` folder:
```powershell
cd api
python -m uvicorn index:app --reload --port 8000
```

### Error: "Port 8000 already in use"  
**Problem:** Server already running  
**Solution:** Close the existing process:
```powershell
# On Windows:
taskkill /F /IM python.exe

# Then restart:
python -m uvicorn index:app --reload --port 8000
```

---

## 🧪 **Verify Servers Running**

### Backend (Port 8000):
Open in browser: http://localhost:8000/api/health

Should show:
```json
{"status": "healthy"}
```

### Frontend (Port 3000):
Open in browser: http://localhost:3000

Should show the TaskFlow app.

---

## 🔐 **Test Login**

Email: `ali@gmail.com`  
Password: `ali1Q@gmail.com`

---

## 📝 **Quick Reference**

| What | Where | Command |
|------|-------|---------|
| Backend | `api/` folder | `python -m uvicorn index:app --reload --port 8000` |
| Frontend | `web-app/` folder | `npm run dev` |
| Kill processes | Any folder | `taskkill /F /IM python.exe` |
| Check API | Browser | http://localhost:8000/docs |

---

## ✅ **Summary**

**CORRECT:**
```
E:\Hackathon_AI\todo-hackathon\api> python -m uvicorn index:app --reload --port 8000
```

**WRONG:**
```
E:\Hackathon_AI\todo-hackathon> python -m uvicorn index:app --reload --port 8000
                              ^^^ Missing 'api' folder!
```

Always make sure you're in the `api` folder before starting the backend!
