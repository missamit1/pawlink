# PawLink — one container: marketing site + React app + Express API
FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite reads env from parent dir in local monorepo; in Docker we keep .env at /app/.env
# or inject VITE_* at build time via --build-arg / Railway variables.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_DEMO_DOG_ID
ARG VITE_PAWLINK_API_URL=
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY \
    VITE_DEMO_DOG_ID=$VITE_DEMO_DOG_ID \
    VITE_PAWLINK_API_URL=$VITE_PAWLINK_API_URL

# Vite envDir normally is repo parent; in Docker use a temp env folder.
RUN mkdir -p /tmp/pawlink-env && \
    printf '%s\n' \
      "VITE_SUPABASE_URL=${VITE_SUPABASE_URL}" \
      "VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}" \
      "VITE_DEMO_DOG_ID=${VITE_DEMO_DOG_ID}" \
      "VITE_PAWLINK_API_URL=${VITE_PAWLINK_API_URL}" \
      > /tmp/pawlink-env/.env
ENV PAWLINK_ENV_DIR=/tmp/pawlink-env
RUN npm run build

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server/production.js"]
