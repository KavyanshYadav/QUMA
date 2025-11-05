# -------- Stage 1: Builder --------
FROM node:20-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json nx.json tsconfig.json tsconfig.base.json ./

# # Copy Nx workspace source (adjust to your structure)
COPY packages ./packages

# COPY . .

RUN ls && sleep 4

RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
        pnpm install --frozen-lockfile --store-dir /pnpm-store


# Install deps using pnpm (fast + deterministic)
RUN npx nx sync && sleep 3
# Build your specific Nx app
RUN npx nx build microService_event


# -------- Stage 2: Runtime --------
FROM node:20-alpine AS runtime

WORKDIR /app
RUN corepack enable

# Copy built output from builder
COPY --from=builder /app/packages/microService_event/dist ./

# Optional: if you want production-only node_modules
# COPY pnpm-lock.yaml package.json ./
# RUN pnpm install --prod --frozen-lockfile

# Run app
CMD ["node", "main.js"]
