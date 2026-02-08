# 🚀 TaskFlow - AI-Powered Cloud Native Todo Application

> **Phase 5: Event-Driven Architecture with Dapr & RedPanda Cloud Kafka**

[![GitHub](https://img.shields.io/badge/GitHub-M%20Ibrahim%20Tayyab-181717?style=for-the-badge&logo=github)](https://github.com/Ibrahim-Tayyab)
[![Docker](https://img.shields.io/badge/Docker-ibuboy-2496ED?style=for-the-badge&logo=docker)](https://hub.docker.com/u/ibuboy)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 👨‍💻 Developer Information

| Field | Details |
|-------|---------|
| **Name** | **M Ibrahim Tayyab** |
| **GitHub** | [https://github.com/Ibrahim-Tayyab](https://github.com/Ibrahim-Tayyab) |
| **Docker Hub** | [https://hub.docker.com/u/ibuboy](https://hub.docker.com/u/ibuboy) |
| **Project** | TaskFlow - AI-Powered Todo App |
| **Phase** | Phase 5 - Event-Driven Architecture |

---

## 📝 Project Description

**TaskFlow** is a production-ready, AI-powered task management application built with modern cloud-native technologies. It demonstrates the evolution from a simple Todo app to a fully-featured, event-driven microservices architecture.

### 🌟 Key Features

- 🤖 **AI Chatbot** - Google Gemini 2.0 powered natural language task creation
- 🔄 **Event-Driven Architecture** - Dapr + RedPanda Cloud Kafka
- 🐳 **Docker Containerization** - Production-ready Docker Compose setup
- 🎨 **Modern UI** - Next.js 14 with Glassmorphism design
- ⚡ **Real-time Updates** - Instant task synchronization
- 🔐 **Authentication** - Secure user login/signup
- 📊 **Advanced Task Management** - Priorities, Categories, Tags, Recurring Tasks

---

## 🏗️ Phase 5 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TaskFlow Architecture                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │   Next.js   │◄──►│   FastAPI   │◄──►│  Dapr Sidecar   │ │
│  │  Frontend   │    │   Backend   │    │   (Pub/Sub)     │ │
│  │  Port:3000  │    │  Port:8000  │    │   Port:3500     │ │
│  └─────────────┘    └─────────────┘    └────────┬────────┘ │
│                                                  │          │
│                                                  ▼          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │   Neon      │◄──►│   Google    │    │  RedPanda Cloud │ │
│  │ PostgreSQL  │    │  Gemini AI  │    │     Kafka       │ │
│  │  (Cloud DB) │    │  (Chatbot)  │    │  (Event Store)  │ │
│  └─────────────┘    └─────────────┘    └─────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TailwindCSS, TypeScript |
| **Backend** | FastAPI, Python 3.11, SQLAlchemy |
| **AI** | Google Gemini 2.0 Flash |
| **Event Broker** | Dapr + RedPanda Cloud Kafka |
| **Database** | Neon PostgreSQL (Serverless) |
| **Containerization** | Docker, Docker Compose |
| **Authentication** | JWT + bcrypt |

---

# 🎬 Phase 5 Demo Video Script (90-120 seconds)

## 📋 Pre-Recording Checklist

- [ ] Docker Desktop running
- [ ] Docker Compose services up (`docker-compose up -d`)
- [ ] App accessible at http://localhost:3000
- [ ] Logged in with test account
- [ ] Browser window clean (close extra tabs)
- [ ] Terminal ready with commands
- [ ] Recording software ready (OBS/Loom/Windows Game Bar)

---

## 🎥 Video Timeline

### **00:00 - 00:15** | Introduction (15 sec)
**Say:**
> "Assalam-o-Alaikum! Main hoon M Ibrahim Tayyab aur yeh meri Phase 5 submission hai Hackathon II: Evolution of Todo ke liye.
> Maine TaskFlow banaya hai - ek AI-powered, cloud-native Todo app jo Event-Driven Architecture use karti hai Dapr aur RedPanda Cloud ke saath."

**Show:**
- App landing page at http://localhost:3000
- Quick view of UI with glassmorphism design

---

### **00:15 - 00:35** | Docker & Architecture (20 sec)
**Say:**
> "Phase 5 mein Docker containerization hai Docker Compose ke saath. Yahan aap dekh saktay hain 3 services running hain:
> Next.js frontend, FastAPI backend, aur Dapr sidecar jo RedPanda Cloud Kafka se connected hai."

**Show (Terminal):**
```powershell
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

**Expected Output:**
```
NAMES               STATUS          PORTS
todo-frontend       Up 5 minutes    0.0.0.0:3000->3000/tcp
todo-backend        Up 5 minutes    0.0.0.0:8000->8000/tcp
todo-backend-dapr   Up 5 minutes    
```

---

### **00:35 - 01:00** | AI Chatbot Demo (25 sec)
**Say:**
> "Ab main aapko AI chatbot dikhata hoon jo Google Gemini 2.0 se powered hai. Main natural language mein task create karta hoon."

**Show:**
1. Click **Chat** button (open chatbot)
2. **Type:** "Add a high priority task to prepare hackathon video presentation for tomorrow"
3. **Wait** for AI response and task creation
4. **Show** task appearing in the list with:
   - High priority (red badge)
   - Tomorrow's due date
5. **Type:** `/list` (show slash commands autocomplete)
6. **Show** task list displayed by AI

---

### **01:00 - 01:30** | Advanced Features (30 sec)
**Say:**
> "Is app mein advanced features hain: priority levels, categories, tags, search, filtering, aur recurring tasks."

**Show:**
1. **Click** on a task to expand
2. **Show** dropdown menus for:
   - Priority (High/Medium/Low with color badges)
   - Category (Work/Personal/Shopping/Health)
3. **Add** a tag to a task
4. **Use** filter dropdown to filter by priority
5. **Demonstrate** search functionality

---

### **01:30 - 01:45** | Event-Driven Architecture (15 sec)
**Say:**
> "Behind the scenes, Dapr events ko RedPanda Cloud Kafka pe publish karta hai. 
> Jab tasks create ya update hotay hain, events task-events aur notifications topics se flow hotay hain."

**Show (Terminal):**
```powershell
docker logs todo-backend-dapr --tail 5
```
Or show architecture diagram from README.

---

### **01:45 - 02:00** | Conclusion (15 sec)
**Say:**
> "Yeh ek production-ready cloud-native application hai jo Event-Driven Architecture follow karti hai.
> Docker images Docker Hub pe publish hain ibuboy/todo-backend aur ibuboy/todo-frontend.
> Sara code GitHub pe available hai. Shukriya dekhne ke liye!"

**Show:**
- Final view of running app
- Docker Hub page (optional)
- GitHub repository (optional)

---

## 🎯 Key Points to Highlight

### Phase 5 Requirements Covered:
| Requirement | Implementation |
|-------------|----------------|
| **Advanced Features** | Recurring tasks, reminders, priorities, categories, tags |
| **Event-Driven Architecture** | Dapr + RedPanda Cloud Kafka |
| **Docker Containerization** | Docker Compose with 3 services |
| **Published Images** | Docker Hub: `ibuboy/todo-backend:phase5`, `ibuboy/todo-frontend:phase5` |
| **AI Integration** | Google Gemini 2.0 chatbot |
| **Cloud Database** | Neon PostgreSQL |

---

## 📝 Commands Quick Reference

### Before Recording:
```powershell
# Start all services
docker-compose up -d

# Check services running
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check health
docker-compose logs --tail 10

# Open app in browser
start http://localhost:3000
```

### During Demo:
```powershell
# Show running containers
docker ps

# Show Dapr sidecar logs
docker logs todo-backend-dapr --tail 5

# Show backend logs
docker logs todo-backend --tail 5
```

### After Recording:
```powershell
# Stop all services
docker-compose down
```

---

## 🎬 Recording Tips

### Before Recording:
1. ✅ Test all demo steps once without recording
2. ✅ Close unnecessary applications
3. ✅ Clear browser history/cache
4. ✅ Prepare all commands in a text file for easy copy-paste
5. ✅ Check audio levels

### During Recording:
1. 🎤 Speak clearly at moderate pace (Urdu/English)
2. ⏱️ Don't rush - 90-120 seconds is enough
3. 🔄 If you make a mistake, pause and restart
4. 🖱️ Move mouse slowly for viewers to follow
5. 📍 Highlight important UI elements

### Video Settings:
- **Resolution:** 1920x1080 (1080p)
- **Format:** MP4
- **Upload to:** YouTube (Unlisted/Public)

---

## 📤 Submission Checklist

| Item | Status | Link |
|------|--------|------|
| GitHub Repository | ✅ Ready | [https://github.com/Ibrahim-Tayyab/todo-hackathon](https://github.com/Ibrahim-Tayyab/todo-hackathon) |
| Docker Hub Images | ✅ Published | [https://hub.docker.com/u/ibuboy](https://hub.docker.com/u/ibuboy) |
| YouTube Video | ⏳ Record & Upload | -- |
| Published App URL | ✅ Docker Compose | localhost:3000 (or cloud URL) |

---

## 🔗 Links for Submission Form

- **Phase V: GitHub URL:** `https://github.com/Ibrahim-Tayyab/todo-hackathon`
- **Phase V: Published App URL:** `http://localhost:3000` (Docker Compose)
- **Phase V: YouTube Video Link:** `https://youtube.com/your-video-link`

---

## 💡 Pro Tips

1. **Show Architecture Diagram** - Include a quick flash of the event-driven architecture diagram
2. **Mention Technologies** - Dapr, Kafka (RedPanda), Docker, Gemini AI
3. **Demonstrate Real-Time** - Show task appearing immediately after AI creates it
4. **Keep It Simple** - Don't try to show everything, focus on key features
5. **End Strong** - Mention Docker Hub images and GitHub repository

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git installed

### Run with Docker Compose
```powershell
# Clone the repository
git clone https://github.com/Ibrahim-Tayyab/todo-hackathon.git
cd todo-hackathon

# Start all services
docker-compose up -d

# Open app in browser
start http://localhost:3000
```

### Test Accounts
| Email | Password |
|-------|----------|
| test@test.com | test123 |
| demo@demo.com | demo123 |

---

## 📁 Project Structure

```
todo-hackathon/
├── api/                    # FastAPI Backend
│   ├── main.py            # Main application
│   ├── models/            # Database models
│   ├── schemas/           # Pydantic schemas
│   ├── services/          # Business logic
│   └── Dockerfile         # Backend container
├── web-app/               # Next.js Frontend
│   ├── src/
│   │   ├── app/          # App router pages
│   │   └── components/   # React components
│   └── Dockerfile        # Frontend container
├── dapr/
│   └── components/       # Dapr configuration
├── docker-compose.yml    # Container orchestration
└── README.md             # This file
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **GIAIC/PIAIC** - For organizing this amazing hackathon
- **Google Gemini** - AI capabilities
- **RedPanda Cloud** - Event streaming
- **Neon** - Serverless PostgreSQL
- **Dapr** - Distributed application runtime

---

**Made with ❤️ by M Ibrahim Tayyab**

*TaskFlow - Phase 5 Complete | Event-Driven Cloud Native Todo App*
