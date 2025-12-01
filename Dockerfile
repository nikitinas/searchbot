FROM python:3.11-slim

WORKDIR /app

# Copy backend files
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY backend/ .

# Expose port (Railway will provide PORT env var)
EXPOSE 8000

# Run the application (use PORT env var if available, fallback to 8000)
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

