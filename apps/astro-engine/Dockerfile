# Multi-stage Dockerfile for FastAPI Astro-Engine with C-bindings (pyswisseph)
FROM python:3.12-slim as builder

# Install build dependencies for C-extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.12-slim

WORKDIR /app

# Copy built dependencies
COPY --from=builder /root/.local /root/.local

# Add pip local bin to Path
ENV PATH=/root/.local/bin:$PATH

COPY src/ ./src/

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
