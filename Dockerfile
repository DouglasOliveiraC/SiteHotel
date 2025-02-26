# Fase 1: Construção do Vue.js
FROM node:20-alpine AS build

WORKDIR /app  # Diretório de trabalho

# Copiar arquivos essenciais para o build
COPY package.json package-lock.json ./

# Instalar dependências sem rodar scripts desnecessários
RUN npm install --frozen-lockfile --ignore-scripts

# 🔹 Adicionando debug para garantir que os arquivos foram copiados
RUN ls -l /app

# Copiar todo o código para dentro do container
COPY . /app

# 🔹 Adicionando debug para verificar se os arquivos foram copiados corretamente
RUN ls -l /app

# Rodar o build do Vue.js
RUN npm run build

# Fase 2: Servir os arquivos estáticos gerados pelo Vue.js
FROM node:20-alpine

WORKDIR /app

# Instalar um servidor estático para servir o Vue.js
RUN npm install -g serve

# Copiar apenas os arquivos de build gerados
COPY --from=build /app/dist /app/dist

# 🔹 Debug final: Verificar se a pasta `dist/` está correta
RUN ls -l /app/dist

# Expor a porta usada pelo Railway
EXPOSE 3000

# Comando correto para servir os arquivos Vue.js no Railway
CMD ["serve", "-s", "dist", "-l", "3000"]
