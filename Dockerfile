# Life Blind Box Runtime — Dockerfile
# Public-safe showcase edition — skeleton for reference only
#
# This Dockerfile is a skeleton. It does NOT build the full production app
# (which requires the private repo with Next.js frontend + Bun voice-game backend).
# Use this as a reference for how the production app would be containerized.

# ====== Stage 1: Build ======
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci || npm install

# Copy source
COPY . .

# Note: This repo has no build step — src/ contains reference modules
RUN echo "No build step needed (public-safe skeleton)"

# ====== Stage 2: Runtime ======
FROM node:20-slim AS runtime

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production 2>/dev/null || npm install --only=production 2>/dev/null || npm install

# Copy source
COPY --from=builder /app ./

# Set environment defaults
ENV NODE_ENV=production
ENV PORT=3000

# Expose port (for reference — this repo does not start a server)
EXPOSE 3000

# Note: No HEALTHCHECK — this repo does not run a server.
# The production app (private repo) has a /health endpoint on the voice-game service.
# If you adapt this Dockerfile for a real server, add:
#   HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#     CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/', r=>process.exit(r.statusCode===200?0:1))"

# Run (prints status, does not start a server)
CMD ["npm", "start"]
