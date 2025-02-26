# Fase 1: Construção do Vue.js
FROM node:20-alpine AS build
WORKDIR /app
# Copiar os arquivos de configuração
COPY package.json package-lock.json ./
# Instalar dependências
RUN npm install --frozen-lockfile --ignore-scripts
# Copiar todo o código do projeto
COPY . .
# Debug: Listar arquivos para verificar que tudo foi copiado
RUN ls -l /app
# Rodar o build do Vue.js
RUN npm run build

# Fase 2: Servir os arquivos estáticos gerados
FROM node:20-alpine
WORKDIR /app
# Copiar package.json e package-lock.json para a fase final
COPY package.json package-lock.json ./
# Instalar o servidor estático (serve)
RUN npm install -g serve
# Copiar apenas a pasta de build gerada
COPY --from=build /app/dist ./dist
# Debug: Listar arquivos para confirmar que package.json e dist/ estão presentes
RUN ls -l /app
RUN ls -l /app/dist
# Expor a porta 3000 (a qual Railway deve usar)
EXPOSE 3000
# Comando para servir os arquivos estáticos
CMD ["serve", "-s", "dist", "-l", "3000"]
