# Fase 1: Construção do Vue.js
FROM node:20-alpine AS build

WORKDIR /app  # Diretório correto

# Copiar arquivos essenciais para o build
COPY package.json package-lock.json ./

# Instalar dependências sem rodar scripts desnecessários
RUN npm install --frozen-lockfile --ignore-scripts

# Copiar todo o código do projeto
COPY . .

# 🔹 ADICIONA DEBUG: Listar arquivos antes do build
RUN ls -l /app

# Rodar o build do Vue.js
RUN npm run build

# Fase 2: Servir os arquivos estáticos gerados pelo Vue.js
FROM node:20-alpine

WORKDIR /app

# Instalar um servidor estático para servir o Vue.js
RUN npm install -g serve

# 🔹 ADICIONA DEBUG: Listar arquivos antes de copiar o build
RUN ls -l /app

# Copiar apenas os arquivos de build gerados
COPY --from=build /app/dist /app/dist

# 🔹 ADICIONA DEBUG: Verificar se a pasta `dist/` foi copiada corretamente
RUN ls -l /app/dist

# Expor a porta usada pelo Railway
EXPOSE 3000

# Comando correto para servir os arquivos Vue.js no Railway
CMD ["serve", "-s", "dist", "-l", "3000"]
