# Fase 1: Construção do Vue.js
FROM node:20-alpine AS build

WORKDIR /app

# Criar a pasta manualmente
RUN mkdir -p /app

# Copiar arquivos essenciais
COPY package.json package-lock.json /app/

WORKDIR /app

# Instalar dependências
RUN npm install --frozen-lockfile --ignore-scripts

# Copiar todo o código do projeto
COPY . /app

# Rodar o build do Vue.js
RUN npm run build

# Debug: Verificar se os arquivos de build foram gerados corretamente
RUN ls -l /app/dist || echo "Erro: dist/ não foi gerado!"

# Fase 2: Servir os arquivos estáticos
FROM node:20-alpine

WORKDIR /app

# Copiar apenas os arquivos de build gerados
COPY --from=build /app/dist /app/dist

# Instalar servidor estático
RUN npm install -g serve

# Debug: Listar arquivos na pasta /app e /app/dist antes de rodar o servidor
RUN ls -l /app && ls -l /app/dist || echo "Pasta /app/dist não encontrada!"

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
