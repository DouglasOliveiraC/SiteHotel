# Fase 1: Construção do Vue.js
FROM node:20-alpine AS build

WORKDIR /app

# Copiar arquivos essenciais e instalar dependências
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile --ignore-scripts

# Copiar todo o código do projeto (incluindo server.js)
COPY . .

# Rodar o build do Vue.js
RUN npm run build

# Fase 2: Imagem final com o servidor Express
FROM node:20-alpine

WORKDIR /app

# Copiar package.json (para garantir que, se necessário, algum script tente acessar)
COPY package.json package-lock.json ./

# Instalar dependências para o servidor
RUN npm install express dotenv node-fetch

# Copiar o servidor e os arquivos de build
COPY server.js ./server.js
COPY --from=build /app/dist ./dist

# Expor a porta definida (Railway deverá usar PORT 3000)
EXPOSE 3000

# Comando para iniciar o servidor Express
CMD ["node", "server.js"]
