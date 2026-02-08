#!/bin/bash
# Build and Deploy Todo App to Minikube

set -e

echo "🚀 Starting Todo App Deployment to Minikube..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Minikube is running
echo -e "${BLUE}Checking Minikube status...${NC}"
if ! minikube status > /dev/null 2>&1; then
    echo -e "${RED}Minikube is not running. Starting Minikube...${NC}"
    minikube start --driver=docker
else
    echo -e "${GREEN}✓ Minikube is running${NC}"
fi

# Set Docker environment to use Minikube's Docker daemon
echo -e "${BLUE}Configuring Docker to use Minikube's daemon...${NC}"
eval $(minikube docker-env)

# Build Frontend Image
echo -e "${BLUE}Building Frontend Docker image...${NC}"
cd web-app
docker build -t todo-frontend:latest .
echo -e "${GREEN}✓ Frontend image built${NC}"
cd ..

# Build Backend Image
echo -e "${BLUE}Building Backend Docker image...${NC}"
cd api
docker build -t todo-backend:latest .
echo -e "${GREEN}✓ Backend image built${NC}"
cd ..

# Create Kubernetes secret from .env file
echo -e "${BLUE}Creating Kubernetes secrets...${NC}"
if [ -f "api/.env" ]; then
    kubectl create secret generic todo-secrets \
        --from-env-file=api/.env \
        --dry-run=client -o yaml | kubectl apply -f -
    echo -e "${GREEN}✓ Secrets created${NC}"
else
    echo -e "${RED}Warning: api/.env not found. Using default secrets.${NC}"
fi

# Deploy using Helm
echo -e "${BLUE}Deploying with Helm...${NC}"
helm upgrade --install todo-app ./helm/todo-app \
    --set frontend.image.pullPolicy=Never \
    --set backend.image.pullPolicy=Never \
    --wait

echo -e "${GREEN}✓ Helm deployment complete${NC}"

# Wait for pods to be ready
echo -e "${BLUE}Waiting for pods to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=120s
kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s

# Get service URL
echo -e "${GREEN}✓ Deployment successful!${NC}"
echo ""
echo -e "${BLUE}Access your application:${NC}"
echo "Frontend: $(minikube service todo-frontend --url)"
echo "Backend:  $(minikube service todo-backend --url)"
echo ""
echo -e "${BLUE}To open in browser:${NC}"
echo "minikube service todo-frontend"
echo ""
echo -e "${BLUE}To view pods:${NC}"
echo "kubectl get pods"
echo ""
echo -e "${BLUE}To view logs:${NC}"
echo "kubectl logs -l app=todo-frontend"
echo "kubectl logs -l app=todo-backend"
