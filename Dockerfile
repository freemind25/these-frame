# ─── ThesisFrame — Multi-stage Docker build ───────────────────────────
# Infomaniak VPS / tout serveur Ubuntu avec Docker
#
# Usage :
#   docker build -t thesisframe .
#   docker compose up -d
#
# Architecture :
#   - Stage 1 (deps)   : install node_modules
#   - Stage 2 (build)  : prisma generate + next build (standalone)
#   - Stage 3 (runner) : lean Node.js image with standalone output

# ═══════════════════════════════════════════════════════════════════════════════
# STAGE 1 — Dependencies
# ═══════════════════════════════════════════════════════════════════════════════
FROM node:22-slim AS deps

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json bun.lock ./
RUN npm install --frozen-lockfile 2>/dev/null || bun install --frozen-lockfile

COPY prisma ./prisma/
RUN npx prisma generate

# ═══════════════════════════════════════════════════════════════════════════════
# STAGE 2 — Build
# ═══════════════════════════════════════════════════════════════════════════════
FROM node:22-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate && npx next build

# ═══════════════════════════════════════════════════════════════════════════════
# STAGE 3 — Runner (production)
# ═══════════════════════════════════════════════════════════════════════════════
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    tini \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --gid 1001 nodejs \
    && useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home appuser

# Copy standalone output
COPY --from=builder /app/.next/standalone ./

# Copy static & public assets
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema for potential migrations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Database directory (volume-mounted in production)
RUN mkdir -p /app/data && chown appuser:nodejs /app/data

# OfficeCLI directory (if binary is volume-mounted)
RUN mkdir -p /app/bin && chown appuser:nodejs /app/bin
ENV PATH="/app/bin:${PATH}"

USER appuser

EXPOSE 3000

ENTRYPOINT ["tini", "--"]
CMD ["node", "server.js"]
