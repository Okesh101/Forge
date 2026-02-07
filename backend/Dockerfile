# 1. Using the full image (includes curl, git, and certificates by default)
FROM python:3.12-slim

# 2. Prevent Python from generating .pyc files and enable real-time logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# 3. We keep the apt-get update just to be safe, adding 'curl' for easy debugging
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 4. Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt 

# 5. Copy the rest of the app (Ensures .env is included if not in .dockerignore)
COPY . .

EXPOSE 5000

# 6. CRITICAL GUNICORN SETTINGS:
# --workers 1: Ensures only ONE scheduler instance starts (prevents duplicate emails)
# --threads 2: Allows the server to handle the API while the Agent sends emails in the background
# --preload: Loads the app BEFORE forking, ensuring APScheduler initializes correctly
# --timeout 120: Prevents Gunicorn from killing the worker while it's waiting for Gmail's SMTP
CMD ["gunicorn", \
    "--bind", "0.0.0.0:5000", \
    "--workers", "1", \
    "--threads", "2", \
    "--preload", \
    "--timeout", "120", \
    "server:app"]