# Fase 1: Construção do Vue.js
FROM node:20-alpine AS build

WORKDIR /app

# Copiar arquivos essenciais e instalar dependências
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile --ignore-scripts

# Copiar todo o código do projeto
COPY . .

# Debug: Verificar arquivos antes do build
RUN echo "📂 Listando arquivos antes do build:" && ls -l /app

# Rodar o build do Vue.js
RUN npm run build

# Debug: Verificar se a pasta dist foi criada
RUN echo "📂 Conteúdo da pasta dist após build:" && ls -l /app/dist

# Fase 2: Imagem final com o servidor Express
FROM node:20-alpine

WORKDIR /app

# Copiar os arquivos de build e o servidor Express
COPY --from=build /app/dist ./dist
COPY server.js ./
COPY package.json package-lock.json ./

# Instalar dependências do servidor Express
RUN npm install express dotenv

# Debug: Verificar se os arquivos foram copiados corretamente
RUN echo "📂 Arquivos no contêiner final:" && ls -l /app

# Expor a porta do servidor
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
