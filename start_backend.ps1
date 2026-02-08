# Stop any existing processes
taskkill /F /IM python.exe /IM dapr.exe /T 2>$null

# Set Python Path
$env:PYTHONPATH = "e:\Hackathon_AI\todo-hackathon\api"

# Run Dapr + Backend from Root
Write-Host "Starting Todo Backend..." -ForegroundColor Green
dapr run --app-id todo-backend --app-port 8000 --dapr-http-port 3500 --read-buffer-size 16 --resources-path "dapr\components" -- python -m uvicorn api.main:app --reload --port 8000
