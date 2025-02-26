# Fase 1: Constru��o do Vue.js
FROM node:20-alpine AS build

WORKDIR /app  # Cria um diret�rio de trabalho tempor�rio

# Copiar arquivos de configura��o e instalar depend�ncias
COPY package*.json ./
RUN npm install

# Copiar todo o c�digo para dentro do container
COPY . .

# Rodar o build do Vue.js
RUN npm run build

# Fase 2: Servir os arquivos est�ticos gerados pelo Vue.js
FROM node:20-alpine

WORKDIR /app  # Define o diret�rio correto

# Instalar um servidor est�tico para servir os arquivos Vue.js
RUN npm install -g serve

# Copiar apenas os arquivos de build gerados
COPY --from=build /app/dist /app/dist

# Expor a porta usada pelo Railway
EXPOSE 3000

# Comando correto para servir os arquivos Vue.js no Railway
CMD ["serve", "-s", "dist", "-l", "3000"]
