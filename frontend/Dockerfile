# Dockerfile para Frontend (React)

# Estágio 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Variáveis de ambiente para o build (podem ser sobrescritas no docker-compose)
ARG REACT_APP_LOCAL_URL=http://localhost:3333
ARG REACT_APP_URL=http://localhost:3000

ENV REACT_APP_LOCAL_URL=$REACT_APP_LOCAL_URL
ENV REACT_APP_URL=$REACT_APP_URL

# Build da aplicação React
RUN npm run build

# Estágio 2: Produção com Nginx
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar configuração customizada do Nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Nginx já inicia automaticamente, mas podemos especificar explicitamente
CMD ["nginx", "-g", "daemon off;"]

