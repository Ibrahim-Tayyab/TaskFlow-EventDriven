@echo off
REM Rebuild frontend image and redeploy

echo Rebuilding frontend with fixed next.config.js...

REM Configure Docker to use Minikube
echo Configuring Docker environment...
@FOR /f "tokens=*" %%i IN ('minikube docker-env --shell cmd') DO @%%i

REM Rebuild frontend image
echo.
echo Building frontend Docker image (this may take a few minutes)...
cd web-app
docker build -t todo-frontend:latest .
cd ..

echo.
echo Frontend image rebuilt successfully!

REM Delete old frontend pods to force restart
echo.
echo Restarting frontend pods...
kubectl delete pod -l app=todo-frontend

echo.
echo Waiting for new pods to start...
timeout /t 15 /nobreak

echo.
echo ===== Pod Status =====
kubectl get pods

echo.
echo ===== Waiting for frontend to be ready =====
kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=300s

echo.
echo ===== Final Status =====
kubectl get pods

echo.
echo Access the app:
minikube service todo-frontend --url

echo.
pause
