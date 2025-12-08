FROM node:22-alpine3.21 AS base

RUN npm install -g pnpm@latest

FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
