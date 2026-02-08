@echo off
REM Fix backend CrashLoopBackOff by recreating secrets

echo Fixing backend deployment...

REM Check backend logs first
echo.
echo ===== Backend Logs (Last 20 lines) =====
kubectl logs -l app=todo-backend --tail=20

echo.
echo ===== Recreating Secrets =====

REM Delete old secret
kubectl delete secret todo-secrets

REM Create new secret from .env file
if exist "api\.env" (
    echo Creating secret from api\.env file...
    kubectl create secret generic todo-secrets --from-env-file=api\.env
    echo Secret created successfully!
) else (
    echo ERROR: api\.env file not found!
    echo Please create api\.env with:
    echo   DATABASE_URL=your_database_url
    echo   OPENROUTER_API_KEY=your_key
    echo   GOOGLE_API_KEY=your_key
    pause
    exit /b 1
)

echo.
echo ===== Restarting Backend Pods =====
kubectl delete pod -l app=todo-backend

echo.
echo Waiting for pods to restart...
timeout /t 10 /nobreak

echo.
echo ===== New Pod Status =====
kubectl get pods

echo.
echo ===== Waiting for pods to be ready =====
kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s

echo.
echo ===== Final Status =====
kubectl get pods

echo.
echo If backend is still crashing, check logs:
echo kubectl logs -l app=todo-backend

pause
