# Usar uma imagem base do Node.js
FROM node:20-alpine

# Diret�rio de trabalho no container
WORKDIR /app

# Copiar apenas os arquivos de configura��o inicialmente
COPY package*.json ./

# Instalar depend�ncias
RUN npm install

# Copiar todo o c�digo do projeto para o container
COPY . .

# Expor a porta usada pelo Vite
EXPOSE 5173

# Comando padr�o para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "dev"]
