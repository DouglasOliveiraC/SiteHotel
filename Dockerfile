# Usar uma imagem base do Node.js
FROM node:20-alpine AS build

# Diretório de trabalho no container
WORKDIR /app

# Copiar arquivos de configuração e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o restante do código para o container
COPY . .

# Construir o frontend Vue.js
RUN npm run build

# Segunda etapa: Servir os arquivos estáticos
FROM node:20-alpine

WORKDIR /app

# Instalar um servidor estático para servir os arquivos
RUN npm install -g serve

# Copiar apenas os arquivos de build
COPY --from=build /app/dist /app/dist

# Expor a porta usada pelo servidor
EXPOSE 3000

# Comando para servir os arquivos estáticos
CMD ["serve", "-s", "dist", "-l", "3000"]
