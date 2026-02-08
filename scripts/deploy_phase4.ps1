# Phase IV Deployment Script
# 1. Configure Docker Env
Write-Host "Configuring Docker Environment..."
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# 2. Build Frontend
Write-Host "Building Frontend Image..."
Set-Location web-app
docker build -t todo-frontend:latest .
if ($LASTEXITCODE -ne 0) { Write-Error "Frontend build failed"; exit 1 }
Set-Location ..

# 3. Build Backend
Write-Host "Building Backend Image..."
Set-Location api
docker build -t todo-backend:latest .
if ($LASTEXITCODE -ne 0) { Write-Error "Backend build failed"; exit 1 }
Set-Location ..

# 4. Create Secrets
Write-Host "Creating Secrets..."
kubectl delete secret todo-secrets --ignore-not-found
kubectl create secret generic todo-secrets `
    --from-literal=DATABASE_URL="postgresql://neondb_owner:npg_S12VpPEGnBkA@ep-dark-surf-aesp74dc-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" `
    --from-literal=BETTER_AUTH_SECRET="R2jTS0GO9XE+1jXMHyXIsYL+mO3onE8AH0JQy64LJ6M=" `
    --from-literal=GOOGLE_API_KEY="AIzaSyBjGcyDwqV4Hggnp43dylGOT-84x-hLMq8" `
    --from-literal=OPENROUTER_API_KEY="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"

# 5. Helm Deployment
Write-Host "Deploying with Helm..."
helm upgrade --install todo-app ./helm/todo-app `
    --set frontend.image.pullPolicy=Never `
    --set backend.image.pullPolicy=Never `
    --wait

Write-Host "Deployment Complete!"
kubectl get pods
