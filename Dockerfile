# Fase 1: Construção do Vue.js
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json e instalar dependências
COPY package.json package-lock.json ./
RUN npm install

# Copiar todo o código para dentro do container
COPY . .

# Rodar o build do Vue.js
RUN npm run build

# Fase 2: Servir os arquivos estáticos gerados
FROM node:20-alpine

WORKDIR /hotel-site  # Alterado

# Instalar um servidor estático para servir o Vue.js
RUN npm install -g serve

# Copiar apenas os arquivos gerados no build
COPY --from=build /app/dist /hotelsite/dist

# Expor a porta usada pelo Railway
EXPOSE 3000

# Comando correto para servir os arquivos Vue.js no Railway
CMD ["serve", "-s", "dist", "-l", "3000"]
