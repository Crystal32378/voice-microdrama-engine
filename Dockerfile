# Voice Microdrama Engine — Dockerfile
# AMD Showcase hackathon skeleton
# Multi-stage build for smaller image

# ====== Stage 1: Build ======
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci || npm install

# Copy source
COPY . .

# Build (if build script exists)
RUN npm run build 2>/dev/null || echo "No build step, skipping"

# ====== Stage 2: Runtime ======
FROM node:20-slim AS runtime

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production 2>/dev/null || npm install --only=production 2>/dev/null || npm install

# Copy built output and source
COPY --from=builder /app ./

# Set environment defaults (mock mode — no API keys needed)
ENV NODE_ENV=production
ENV LLM_PROVIDER=mock
ENV ASR_PROVIDER=mock
ENV TTS_PROVIDER=mock
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check (optional — adjust if you add a health endpoint)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Run the app
CMD ["npm", "start"]
