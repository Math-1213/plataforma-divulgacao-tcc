# Dockerfile para o Backend (AdonisJS)
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./
COPY yarn.lock ./

# Instala as dependências
RUN npm install

# Copia o resto dos arquivos do projeto
COPY . .

# Expõe a porta do backend
EXPOSE 3333

# Comando para iniciar o servidor
CMD ["npm", "run", "dev"]

