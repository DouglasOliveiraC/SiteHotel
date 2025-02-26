# Fase 1: Construção do Vue.js
FROM node:20-alpine AS build

WORKDIR /app

# Criar a pasta manualmente para evitar problemas
RUN mkdir -p /app

# Copiar arquivos essenciais
COPY package.json package-lock.json /app/

WORKDIR /app

# Instalar dependências
RUN npm install --frozen-lockfile --ignore-scripts

# Copiar todo o código do projeto
COPY . /app

# Debug: Listar arquivos antes do build
RUN ls -l /app

# Rodar o build do Vue.js
RUN npm run build

# Fase 2: Servir os arquivos estáticos
FROM node:20-alpine

WORKDIR /app

# Instalar servidor estático para Vue.js
RUN npm install -g serve

# Copiar apenas os arquivos de build gerados
COPY --from=build /app/dist /app/dist

# Debug: Verificar se dist/ foi copiada corretamente
RUN ls -l /app/dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
