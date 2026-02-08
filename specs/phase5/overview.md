# Phase 5: Event-Driven Architecture with Dapr & RedPanda Cloud

## 👨‍💻 Developer
**M Ibrahim Tayyab** | [GitHub](https://github.com/Ibrahim-Tayyab) | [Docker Hub](https://hub.docker.com/u/ibuboy)

## 🎯 Goal
Transform TaskFlow into a production-ready, event-driven microservices architecture using Dapr and RedPanda Cloud Kafka. Containerized with Docker Compose for easy deployment.

## 📋 Scope

### Part A: Advanced Features ✅
1.  **Recurring Tasks**: Automate task creation based on schedules (daily, weekly, etc.).
2.  **Smart Reminders**: Push notifications for due tasks.
3.  **Advanced Organization**:
    -   Priority Levels (High, Medium, Low)
    -   Tags/Categories (Work, Personal, etc.)
    -   Search & Filtering
    -   Sorting

### Part B: Event-Driven Architecture ✅
1.  **Dapr Integration**:
    -   **Pub/Sub**: Abstract Kafka via Dapr sidecar
    -   **Topics**: task-events, notifications
    -   **Events**: task.created, task.updated, task.deleted
2.  **RedPanda Cloud Kafka**:
    -   Cloud-hosted Kafka service
    -   SASL authentication
    -   Automatic topic management

### Part C: Docker Containerization ✅
1.  **Docker Compose**: 3 services (frontend, backend, dapr)
2.  **Docker Hub**: Published images
    -   `ibuboy/todo-backend:phase5`
    -   `ibuboy/todo-frontend:phase5`
3.  **Easy Deployment**: Single command startup

## 🛠️ Technical Stack
| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14, React 18, TailwindCSS |
| **Backend** | FastAPI, Python 3.11, SQLAlchemy |
| **AI** | Google Gemini 2.0 Flash |
| **Event Broker** | Dapr + RedPanda Cloud Kafka |
| **Database** | Neon PostgreSQL |
| **Containerization** | Docker, Docker Compose |

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    TaskFlow Architecture                     │
├─────────────────────────────────────────────────────────────┤
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
│  └─────────────┘    └─────────────┘    └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Specs Structure
```
specs/phase5/
├── overview.md      # This file - Project overview
├── spec.md          # Technical specification
├── plan.md          # Implementation plan
├── tasks.md         # Task breakdown
├── architecture/    # Architecture details
├── deployment/      # Deployment guides
└── features/        # Feature specifications
```

## ✅ Implementation Status
| Task | Status |
|------|--------|
| RedPanda Cloud Setup | ✅ Complete |
| Dapr Configuration | ✅ Complete |
| Docker Compose | ✅ Complete |
| Event Publishing | ✅ Complete |
| Docker Hub Images | ✅ Complete |
| Demo Video | ⏳ Pending |
| Submission | ⏳ Pending |

## 🚀 Quick Start
```powershell
# Clone and run
git clone https://github.com/Ibrahim-Tayyab/TaskFlow-EventDriven.git
cd TaskFlow-EventDriven
docker-compose up -d

# Open app
start http://localhost:3000
```

## 🔗 Links
- **GitHub**: https://github.com/Ibrahim-Tayyab
- **Docker Hub**: https://hub.docker.com/u/ibuboy
- **App URL**: http://localhost:3000
    -   Notification Service (Consumer)
    -   Search/Filter API
5.  **Deployment**: Kubernetes manifests & Helm charts.
