# ============================================
# Backend Dockerfile - Production Ready
# Phase V: Cloud Deployment with Dapr + Kafka
# Docker Hub: ibuboy/todo-backend:phase5
# ============================================
# Build: docker build -t ibuboy/todo-backend:phase5 .
# Push:  docker push ibuboy/todo-backend:phase5
# ============================================

FROM python:3.11-slim

# Set environment variables
ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies including Dapr and Uvicorn
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir dapr uvicorn[standard] gunicorn

# Copy application code
COPY . .

# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser \
    && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Run the application with Uvicorn
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
