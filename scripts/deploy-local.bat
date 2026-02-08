@echo off
REM Build and Deploy Todo App to Minikube (Windows)

echo Starting Todo App Deployment to Minikube...

REM Check if Minikube is running
echo Checking Minikube status...
minikube status >nul 2>&1
if %errorlevel% neq 0 (
    echo Minikube is not running. Starting Minikube...
    minikube start --driver=docker
) else (
    echo Minikube is running
)

REM Set Docker environment to use Minikube's Docker daemon
echo Configuring Docker to use Minikube's daemon...
@FOR /f "tokens=*" %%i IN ('minikube docker-env --shell cmd') DO @%%i

REM Build Frontend Image
echo Building Frontend Docker image...
cd web-app
docker build -t todo-frontend:latest .
echo Frontend image built
cd ..

REM Build Backend Image
echo Building Backend Docker image...
cd api
docker build -t todo-backend:latest .
echo Backend image built
cd ..

REM Create Kubernetes secret from .env file
echo Creating Kubernetes secrets...
if exist "api\.env" (
    kubectl create secret generic todo-secrets --from-env-file=api\.env --dry-run=client -o yaml | kubectl apply -f -
    echo Secrets created
) else (
    echo Warning: api\.env not found. Using default secrets.
)

REM Deploy using Helm
echo Deploying with Helm...
helm upgrade --install todo-app .\helm\todo-app --set frontend.image.pullPolicy=Never --set backend.image.pullPolicy=Never --wait

echo Helm deployment complete

REM Wait for pods to be ready
echo Waiting for pods to be ready...
kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=120s
kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s

REM Get service URLs
echo Deployment successful!
echo.
echo Access your application:
minikube service todo-frontend --url
minikube service todo-backend --url
echo.
echo To open in browser:
echo minikube service todo-frontend
echo.
echo To view pods:
echo kubectl get pods
echo.
echo To view logs:
echo kubectl logs -l app=todo-frontend
echo kubectl logs -l app=todo-backend

pause
