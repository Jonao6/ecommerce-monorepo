FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y openssl
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter api exec prisma generate
RUN pnpm --recursive build

FROM build AS web-pruned
RUN pnpm --filter web --prod deploy /prod/web

FROM build AS api-pruned
RUN pnpm --filter api --prod deploy /prod/api

FROM base AS web
COPY --from=web-pruned /prod/web /app
WORKDIR /app
EXPOSE 3000
ENV NODE_ENV=production
CMD ["pnpm", "start"]

FROM base AS api
COPY --from=api-pruned /prod/api /app
WORKDIR /app
EXPOSE 4000
ENV NODE_ENV=production
CMD ["sh", "-c", "node dist/server/index.js"]