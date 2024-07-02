FROM node:22-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci && chown -R node:node /app

COPY --chown=node:node . .
USER node

ENV PORT=8080
EXPOSE 8080
CMD [ "node", "index.mjs" ]
