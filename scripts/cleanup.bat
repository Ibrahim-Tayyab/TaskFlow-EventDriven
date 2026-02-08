@echo off
REM Cleanup Minikube deployment (Windows)

echo Cleaning up Todo App deployment...

REM Uninstall Helm release
echo Removing Helm release...
helm uninstall todo-app 2>nul || echo Helm release not found

REM Delete secrets
echo Deleting secrets...
kubectl delete secret todo-secrets 2>nul || echo Secret not found

REM Delete all resources
echo Deleting all resources...
kubectl delete all -l app=todo-frontend
kubectl delete all -l app=todo-backend

echo Cleanup complete!
pause
