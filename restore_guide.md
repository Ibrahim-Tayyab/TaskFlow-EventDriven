# 🔄 How to Run on a NEW Computer (Restoration Guide)

So you bought a new PC and want to run your **Todo App** immediately? Follow this guide.

---

## 🧐 Why didn't I see "Running" containers in Docker Desktop?
You saw only one container called `minikube`. **This is correct.**
*   **Think of Minikube as a "Virtual Computer" inside your PC.**
*   Your Todo App (Frontend & Backend) is running *inside* that Minikube box.
*   Docker Desktop only shows the box, not what's inside it.
*   To see what's inside, you use the command `kubectl get pods`.

---

## 🚀 Steps to Restore on a Fresh PC

### 1. Prerequisite (Install Tools)
On the new computer, install:
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/)
*   [Minikube](https://minikube.sigs.k8s.io/docs/start/)

### 2. Get Your Code
Download and unzip your **Complete Code Backup** (`todo-phase4-complete.zip`) to a folder (e.g., `C:\Projects\todo-hackathon`).

### 3. Start the Cluster
Open PowerShell in that folder:
```powershell
minikube start
```

### 4. Deploy Using Your Cloud Images
Since you pushed your working images to Docker Hub (`phase4` tag), you don't need to rebuild them!

**First, update your helm configuration** to point to your online images.
Open `helm/todo-app/values.yaml` and change:
*   Frontend Image Repository: `YOUR_DOCKER_USERNAME/todo-frontend`
*   Frontend Image Tag: `phase4`
*   Backend Image Repository: `YOUR_DOCKER_USERNAME/todo-backend`
*   Backend Image Tag: `phase4`

**Then, tell Kubernetes to download and run them:**
```powershell
helm upgrade --install todo-app ./helm/todo-app --wait
```

### 5. Open the Doors (Port Forwarding)
Just like before:
```powershell
# In Terminal 1
kubectl port-forward svc/todo-backend 8000:8000

# In Terminal 2
kubectl port-forward svc/todo-frontend 3000:3000
```

---

That's it! Your app will download from the cloud (Docker Hub) and run exactly as it was when you saved it. ✅
