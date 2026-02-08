@echo off
REM Deploy using kubectl directly (Backup if Helm not working)

echo Deploying Todo App using kubectl...

REM Configure Docker environment
echo Configuring Docker to use Minikube's daemon...
@FOR /f "tokens=*" %%i IN ('minikube docker-env --shell cmd') DO @%%i

REM Check if images exist
echo.
echo Checking Docker images...
docker images | findstr todo-frontend
docker images | findstr todo-backend

REM Check if secrets exist, create if not
echo.
echo Checking secrets...
kubectl get secret todo-secrets >nul 2>&1
if %errorlevel% neq 0 (
    echo Creating secrets...
    kubectl create secret generic todo-secrets --from-env-file=api\.env
) else (
    echo Secrets already exist
)

REM Apply Kubernetes manifests
echo.
echo Deploying frontend...
kubectl apply -f k8s\frontend-deployment.yaml
kubectl apply -f k8s\frontend-service.yaml

echo Deploying backend...
kubectl apply -f k8s\backend-deployment.yaml
kubectl apply -f k8s\backend-service.yaml

REM Wait for pods
echo.
echo Waiting for pods to be ready...
kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=120s
kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s

REM Check status
echo.
echo ===== Deployment Status =====
kubectl get pods
echo.
kubectl get services

REM Get URLs
echo.
echo ===== Access URLs =====
minikube service todo-frontend --url
echo.
echo To open in browser:
echo minikube service todo-frontend

pause
