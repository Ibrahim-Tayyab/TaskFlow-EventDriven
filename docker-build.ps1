# ============================================
# Docker Build & Push Script
# Phase V: Production Deployment
# Docker Hub: ibuboy/todo-backend:phase5
#             ibuboy/todo-frontend:phase5
# ============================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "TaskFlow - Docker Build & Push Script" -ForegroundColor Cyan
Write-Host "Phase V: Production Deployment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker is running" -ForegroundColor Green

# Set variables
$DOCKER_HUB_USERNAME = "ibuboy"
$BACKEND_IMAGE = "$DOCKER_HUB_USERNAME/todo-backend"
$FRONTEND_IMAGE = "$DOCKER_HUB_USERNAME/todo-frontend"
$TAG = "phase5"

Write-Host ""
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "Step 1: Building Backend Image" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "Image: ${BACKEND_IMAGE}:${TAG}" -ForegroundColor Gray

Set-Location -Path "api"
docker build -t "${BACKEND_IMAGE}:${TAG}" -t "${BACKEND_IMAGE}:latest" .
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Backend build failed!" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}
Write-Host "✓ Backend image built successfully" -ForegroundColor Green
Set-Location -Path ".."

Write-Host ""
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "Step 2: Building Frontend Image" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "Image: ${FRONTEND_IMAGE}:${TAG}" -ForegroundColor Gray

Set-Location -Path "web-app"
docker build -t "${FRONTEND_IMAGE}:${TAG}" -t "${FRONTEND_IMAGE}:latest" .
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}
Write-Host "✓ Frontend image built successfully" -ForegroundColor Green
Set-Location -Path ".."

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "BUILD COMPLETE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Images built:" -ForegroundColor Cyan
Write-Host "  - ${BACKEND_IMAGE}:${TAG}" -ForegroundColor White
Write-Host "  - ${BACKEND_IMAGE}:latest" -ForegroundColor White
Write-Host "  - ${FRONTEND_IMAGE}:${TAG}" -ForegroundColor White
Write-Host "  - ${FRONTEND_IMAGE}:latest" -ForegroundColor White
Write-Host ""

# Ask if user wants to push
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "Step 3: Push to Docker Hub (Optional)" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
$push = Read-Host "Do you want to push images to Docker Hub? (y/n)"

if ($push -eq "y" -or $push -eq "Y") {
    Write-Host ""
    Write-Host "Logging into Docker Hub..." -ForegroundColor Gray
    docker login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Docker login failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "Pushing backend image..." -ForegroundColor Gray
    docker push "${BACKEND_IMAGE}:${TAG}"
    docker push "${BACKEND_IMAGE}:latest"
    
    Write-Host ""
    Write-Host "Pushing frontend image..." -ForegroundColor Gray
    docker push "${FRONTEND_IMAGE}:${TAG}"
    docker push "${FRONTEND_IMAGE}:latest"
    
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "PUSH COMPLETE!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Images available on Docker Hub:" -ForegroundColor Cyan
    Write-Host "  - docker pull ${BACKEND_IMAGE}:${TAG}" -ForegroundColor White
    Write-Host "  - docker pull ${FRONTEND_IMAGE}:${TAG}" -ForegroundColor White
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "1. Test locally with: docker-compose up -d" -ForegroundColor White
Write-Host "2. View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "3. Access frontend: http://localhost:3000" -ForegroundColor White
Write-Host "4. Access backend: http://localhost:8000/api/health" -ForegroundColor White
Write-Host ""
