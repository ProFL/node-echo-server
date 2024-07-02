FROM node:22-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY index.mjs ./
RUN chown -R node:node /app
USER node

ENV PORT=8080
EXPOSE 8080
CMD [ "node", "index.mjs" ]
