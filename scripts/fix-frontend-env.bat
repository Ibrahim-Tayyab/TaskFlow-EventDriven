@echo off
rem ---- fix-frontend-env.bat ----

for /f "delims=" %%P in ('kubectl get svc todo-backend -o jsonpath="{.spec.ports[0].nodePort}"') do set BACKEND_PORT=%%P

echo Backend NodePort = %BACKEND_PORT%

kubectl set env deployment/todo-frontend NEXT_PUBLIC_API_URL="http://localhost:%BACKEND_PORT%"

kubectl rollout restart deployment/todo-frontend

echo.
echo Frontend env update ho chuki hai.
echo minikube service todo-frontend --url
echo Browser mein URL open karo aur Login/Signup karo.
pause
