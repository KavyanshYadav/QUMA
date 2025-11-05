#  -------- Stage 1: Builder --------
FROM node:20-alpine AS builder

RUN corepack enable

WORKDIR /app

# Copy essential workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json nx.json tsconfig.json tsconfig.base.json ./

# Copy all packages
COPY packages ./packages

# Install deps (cached)
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --store-dir /pnpm-store

# Disable Nx Daemon (prevents hang)
ENV NX_DAEMON=false
ENV NX_SKIP_VITE_PLUGINS=1
# Sync workspace & build
RUN npx nx sync
RUN npx nx build microservice_tickets

# -------- Stage 2: Runtime --------
FROM node:20-alpine AS runtime

WORKDIR /app
RUN corepack enable

# Copy built outputs for service + required local libs
COPY --from=builder /app/packages/microservice_tickets/dist ./packages/microservice_tickets/dist
# COPY --from=builder /app/packages/quma_ddd/dist ./packages/quma_ddd/dist
# COPY --from=builder /app/packages/quma_config/dist ./packages/quma_config/dist

# Copy minimal dependency metadata for prod install
COPY pnpm-lock.yaml package.json ./

# Install only external deps (not workspace)
RUN pnpm install --prod --frozen-lockfile

# Link local libs as Node modules
# RUN mkdir -p node_modules/@quma \
#  && ln -s /app/packages/quma_ddd/dist node_modules/@quma/ddd \
#  && ln -s /app/packages/quma_config/dist node_modules/@quma/config



# Run app from its dist folder
WORKDIR /app/packages/microservice_tickets/dist
CMD ["node", "main.js"]
