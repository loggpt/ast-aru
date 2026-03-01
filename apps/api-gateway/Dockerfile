# Base stage
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy root configurations
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy packages and apps needed for the build
COPY packages/esoteric-wrappers ./packages/esoteric-wrappers
COPY apps/api-gateway ./apps/api-gateway

# Install dependencies (only required ones)
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS build
WORKDIR /app
# Build esoteric-wrappers if necessary (assuming tsc compilation)
RUN cd packages/esoteric-wrappers && pnpm install && pnpm exec tsc

# Build the api-gateway
RUN cd apps/api-gateway && pnpm exec tsc

# Production stage
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy node_modules from base
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages/esoteric-wrappers ./packages/esoteric-wrappers
COPY --from=base /app/apps/api-gateway/node_modules ./apps/api-gateway/node_modules

# Copy built files
COPY --from=build /app/apps/api-gateway/dist ./apps/api-gateway/dist
COPY --from=build /app/apps/api-gateway/package.json ./apps/api-gateway/package.json

EXPOSE 3000

CMD ["node", "apps/api-gateway/dist/server.js"]
