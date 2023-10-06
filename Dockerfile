FROM node:18-alpine AS deps
WORKDIR /app
RUN apk upgrade --update-cache --available && \
    rm -rf /var/cache/apk/*
COPY package.json  ./
RUN yarn install --frozen-lockfile --production=false
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN yarn run build
FROM node:18-alpine AS runner
RUN apk add openssl
WORKDIR /app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/videos ./videos
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
USER root
CMD [ "yarn", "run", "start:prod" ]