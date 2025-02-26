# Fase 1: Build do Vue.js
FROM node:20-alpine AS build
WORKDIR /app

# Copiar e instalar dependências
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile --ignore-scripts

# Copiar todo o código (incluindo .env se necessário)
COPY . .

# Rodar o build do Vue.js
RUN npm run build

# Fase 2: Servidor Express
FROM node:20-alpine
WORKDIR /app

# Copiar package.json para instalar apenas o que for preciso
COPY package.json package-lock.json ./
RUN npm install --production

# Instalar libs extras para o server
RUN npm install express dotenv node-fetch

# Copiar o servidor e a pasta dist
COPY --from=build /app/dist ./dist
COPY server.js ./

EXPOSE 3000
CMD ["node", "server.js"]
