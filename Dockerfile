# Fase 1: Constru��o do projeto Vue.js
FROM node:20-alpine AS build

WORKDIR /app

# Copiar e instalar depend�ncias
COPY package*.json ./
RUN npm install

# Copiar c�digo-fonte e gerar build
COPY . .
RUN npm run build

# Fase 2: Servir os arquivos est�ticos
FROM node:20-alpine

WORKDIR /app

# Instalar servidor est�tico para servir os arquivos Vue.js
RUN npm install -g serve

# Copiar apenas os arquivos da build
COPY --from=build /app/dist /app/dist

# Expor a porta usada pelo Railway
EXPOSE 3000

# Comando para servir os arquivos Vue.js
CMD ["serve", "-s", "dist", "-l", "3000"]
