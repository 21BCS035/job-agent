# Playwright base image: browsers + OS deps (bump tag when you upgrade package.json "playwright").
FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

RUN npx playwright install chromium

COPY tsconfig.json ./
COPY src ./src
COPY resume.txt ./resume.txt

RUN npm run build \
  && npm prune --omit=dev \
  && mkdir -p uploads

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]
