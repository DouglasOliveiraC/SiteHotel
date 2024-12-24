# Usar uma imagem base do Node.js
FROM node:20-alpine

# Diretório de trabalho no container
WORKDIR /app

# Copiar apenas os arquivos de configuração inicialmente
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código do projeto para o container
COPY . .

# Expor a porta usada pelo Vite
EXPOSE 5173

# Comando padrão para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "dev"]
