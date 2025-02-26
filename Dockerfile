# Fase 1: Constru��o do Vue.js
FROM node:20-alpine AS build

WORKDIR /app  # Define o diret�rio de trabalho corretamente

# Copiar arquivos essenciais para o build
COPY package.json package-lock.json ./

# Instalar depend�ncias sem rodar scripts desnecess�rios
RUN npm install --frozen-lockfile --ignore-scripts

# Copiar todo o c�digo do projeto
COPY . .

# Rodar o build do Vue.js
RUN npm run build

# Fase 2: Servir os arquivos est�ticos gerados pelo Vue.js
FROM node:20-alpine

WORKDIR /app  # Define o diret�rio correto

# Instalar um servidor est�tico para servir o Vue.js
RUN npm install -g serve

# Copiar apenas os arquivos de build gerados
COPY --from=build /app/dist /app/dist

# Expor a porta usada pelo Railway
EXPOSE 3000

# Comando correto para servir os arquivos Vue.js no Railway
CMD ["serve", "-s", "dist", "-l", "3000"]
