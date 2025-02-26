# Fase 1: Build do Vue.js
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile --ignore-scripts
COPY . .
RUN npm run build

# Fase 2: Servidor Express
FROM node:20-alpine
WORKDIR /app

# Copiar arquivos necessários
COPY package.json package-lock.json ./
RUN npm install --production

# Instalar node-fetch e Express
RUN npm install node-fetch express dotenv

COPY --from=build /app/dist ./dist
COPY server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
