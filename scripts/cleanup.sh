#!/bin/bash
# Cleanup Minikube deployment

set -e

echo "🧹 Cleaning up Todo App deployment..."

# Uninstall Helm release
echo "Removing Helm release..."
helm uninstall todo-app || echo "Helm release not found"

# Delete secrets
echo "Deleting secrets..."
kubectl delete secret todo-secrets || echo "Secret not found"

# Delete all resources
echo "Deleting all resources..."
kubectl delete all -l app=todo-frontend
kubectl delete all -l app=todo-backend

echo "✓ Cleanup complete!"
