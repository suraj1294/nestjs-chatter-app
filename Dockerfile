FROM node:20-alpine AS ui
WORKDIR /app
COPY /chatter-ui/package.json /chatter-ui/package-lock.json ./
RUN npm install
COPY /chatter-ui ./
RUN npm run build

FROM node:20-alpine AS api
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS server
WORKDIR /app
COPY package* ./
RUN npm install --omit-dev
COPY --from=ui ./app/dist ./public
COPY --from=api ./app/dist ./dist
EXPOSE 3000
CMD [ "node", "dist/main.js" ]