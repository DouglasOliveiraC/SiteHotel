# Fase 1: Construção do Vue.js
FROM node:20-alpine AS build

WORKDIR /app

# Copiar apenas arquivos essenciais para otimizar cache
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install --frozen-lockfile --ignore-scripts

# Copiar todo o código do projeto
COPY . .

# Rodar o build do Vue.js
RUN npm run build

# Fase 2: Servir os arquivos estáticos
FROM node:20-alpine

WORKDIR /app

# Instalar um servidor estático (serve)
RUN npm install -g serve

# Copiar apenas os arquivos de build gerados
COPY --from=build /app/dist ./dist

# Definir a porta que será usada
EXPOSE 3000

# Comando para rodar o servidor
CMD ["serve", "-s", "dist", "-l", "3000"]
