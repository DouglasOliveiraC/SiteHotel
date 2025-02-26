# Fase 1: Construção do Vue.js
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile --ignore-scripts
COPY . .
RUN npm run build

# Fase 2: Servir os arquivos estáticos + Servidor Express.js
FROM node:20-alpine
WORKDIR /app

# Instalar dependências para o servidor
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile --ignore-scripts
RUN npm install express dotenv node-fetch

# Instalar um servidor estático para o Vue.js
RUN npm install -g serve

# Copiar apenas os arquivos de build do Vue.js
COPY --from=build /app/dist ./dist
COPY server.js ./server.js

# Definir a porta que será usada
EXPOSE 3000

# Iniciar o servidor
CMD ["node", "server.js"]
