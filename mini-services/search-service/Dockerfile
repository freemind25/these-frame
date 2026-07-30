# ─── Search Service (Bun + Hono) ───────────────────────────────
FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY index.ts .

EXPOSE 3031

ENTRYPOINT ["bun", "--hot", "index.ts"]
