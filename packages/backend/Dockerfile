FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# COPY package.json pnpm-lock.yaml ./
# COPY packages/backend/package.json packages/backend/
# COPY packages/quma_ddd/package.json packages/ddd/
# COPY packages/quma_config/package.json packages/config/
# COPY packages/quma_types/package.json packages/types/
# COPY packages/quma_oauth_frontend_web/package.json packages/quma_oauth_frontend_web/

# Copy everything
COPY . .
RUN pnpm install --frozen-lockfile


# Build backend + frontend
RUN pnpm nx build @quma/backend 

EXPOSE 3000

CMD ["node", "packages/backend/dist/index.js"]
