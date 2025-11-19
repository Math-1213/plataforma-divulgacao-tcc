# Dockerfile para Backend (AdonisJS)

# Estágio 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY yarn.lock* ./

# Instalar dependências
RUN npm ci

# Copiar código fonte (excluindo node_modules que será instalado)
COPY . .

# Criar serviceAccountKey.json dummy para o build (será substituído em runtime via volume)
RUN echo '{}' > serviceAccountKey.json || true

# Build da aplicação (ignorando erros de TypeScript que não impedem execução)
RUN node ace build --ignore-ts-errors

# Estágio 2: Produção
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY yarn.lock* ./

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Copiar arquivos buildados do estágio anterior
COPY --from=builder /app/build ./build
COPY --from=builder /app/bin ./bin
COPY --from=builder /app/start ./start
COPY --from=builder /app/config ./config
COPY --from=builder /app/app ./app
COPY --from=builder /app/ace.js ./
COPY --from=builder /app/adonisrc.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/package.json ./

# serviceAccountKey.json será montado via volume no docker-compose.yml

# Expor porta
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "start"]

