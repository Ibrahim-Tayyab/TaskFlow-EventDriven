@echo off
REM Rebuild backend image and redeploy

echo Rebuilding backend with fixed Dockerfile...

REM Configure Docker to use Minikube
echo Configuring Docker environment...
@FOR /f "tokens=*" %%i IN ('minikube docker-env --shell cmd') DO @%%i

REM Rebuild backend image
echo.
echo Building backend Docker image...
cd api
docker build -t todo-backend:latest .
cd ..

echo.
echo Backend image rebuilt successfully!

REM Delete old backend pods to force restart
echo.
echo Restarting backend pods...
kubectl delete pod -l app=todo-backend

echo.
echo Waiting for new pods to start...
timeout /t 15 /nobreak

echo.
echo ===== Pod Status =====
kubectl get pods

echo.
echo ===== Waiting for backend to be ready =====
kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s

echo.
echo ===== Final Status =====
kubectl get pods

echo.
echo ===== Backend Logs =====
kubectl logs -l app=todo-backend --tail=20

echo.
echo If backend is running, access the app:
echo minikube service todo-frontend

pause
