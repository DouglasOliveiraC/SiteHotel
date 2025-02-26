# Fase 1: Construção do Vue.js
FROM node:20-alpine AS build

WORKDIR /app  # Cria um diretório de trabalho temporário

# Copiar arquivos de configuração e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar todo o código para dentro do container
COPY . .

# Rodar o build do Vue.js
RUN npm run build

# Fase 2: Servir os arquivos estáticos gerados pelo Vue.js
FROM node:20-alpine

WORKDIR /app  # Define o diretório correto

# Instalar um servidor estático para servir os arquivos Vue.js
RUN npm install -g serve

# Copiar apenas os arquivos de build gerados
COPY --from=build /app/dist /app/dist

# Expor a porta usada pelo Railway
EXPOSE 3000

# Comando correto para servir os arquivos Vue.js no Railway
CMD ["serve", "-s", "dist", "-l", "3000"]
