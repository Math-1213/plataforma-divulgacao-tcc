# Docker Setup - Plataforma de Divulgação de TCC

Este documento contém instruções para executar o projeto usando Docker e Docker Compose.

## Pré-requisitos

- Docker instalado (versão 20.10 ou superior)
- Docker Compose instalado (versão 2.0 ou superior)

## Configuração Inicial

### 1. Arquivo de Chave do Firebase

Certifique-se de que o arquivo `serviceAccountKey.json` do Firebase está presente na pasta `backend/`:

```bash
backend/serviceAccountKey.json
```

Este arquivo é necessário para que o backend se conecte ao Firebase (Firestore e Auth).

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (opcional, mas recomendado):

```env
APP_KEY=your-secret-app-key-here
```

Para gerar uma chave APP_KEY válida para AdonisJS, você pode executar:

```bash
cd backend
node ace generate:key
```

## Executando o Projeto

### Build e Iniciar os Containers

Na raiz do projeto, execute:

```bash
docker-compose up --build
```

Isso irá:
1. Construir as imagens Docker para backend e frontend
2. Iniciar os containers
3. Backend estará disponível em: `http://localhost:3333`
4. Frontend estará disponível em: `http://localhost:3000`

### Executar em Background (Detached Mode)

```bash
docker-compose up -d --build
```

### Parar os Containers

```bash
docker-compose down
```

### Ver Logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend
```

### Reconstruir os Containers

Se você fez alterações no código e precisa reconstruir:

```bash
docker-compose up --build
```

Ou para forçar a reconstrução sem usar cache:

```bash
docker-compose build --no-cache
docker-compose up
```

## Estrutura dos Containers

### Backend (AdonisJS)
- **Porta**: 3333
- **Container**: `plataforma-backend`
- **Imagem**: Construída a partir de `backend/Dockerfile`
- **Variáveis de Ambiente**:
  - `NODE_ENV=production`
  - `PORT=3333`
  - `HOST=0.0.0.0`
  - `APP_KEY` (definida no .env ou docker-compose.yml)
  - `LOG_LEVEL=info`

### Frontend (React)
- **Porta**: 3000 (mapeada para porta 80 do container Nginx)
- **Container**: `plataforma-frontend`
- **Imagem**: Construída a partir de `frontend/Dockerfile`
- **Servidor**: Nginx (servindo arquivos estáticos do build do React)

## Desenvolvimento

### Opção 1: Docker Compose para Desenvolvimento (com Hot-Reload)

Use o arquivo `docker-compose.dev.yml` que monta os volumes para hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Isso permite que as alterações no código sejam refletidas automaticamente sem precisar reconstruir os containers.

### Opção 2: Executar Localmente (sem Docker)

Para desenvolvimento, você pode preferir executar os serviços localmente:

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Troubleshooting

### Erro: serviceAccountKey.json não encontrado

Certifique-se de que o arquivo existe em `backend/serviceAccountKey.json`. Se não tiver, você precisa:
1. Acessar o Firebase Console
2. Ir em Project Settings → Service Accounts
3. Gerar uma nova chave privada
4. Salvar como `serviceAccountKey.json` na pasta `backend/`

### Erro: APP_KEY inválida

Gere uma nova chave APP_KEY:
```bash
cd backend
node ace generate:key
```

Copie a chave gerada para o arquivo `.env` ou `docker-compose.yml`.

### Porta já em uso

Se as portas 3333 ou 3000 já estiverem em uso, você pode alterar no `docker-compose.yml`:

```yaml
ports:
  - "3334:3333"  # Mude a porta externa
```

### Limpar tudo e começar do zero

```bash
# Parar e remover containers, volumes e redes
docker-compose down -v

# Remover imagens
docker-compose down --rmi all

# Limpar sistema Docker (cuidado: remove tudo não utilizado)
docker system prune -a
```

## Produção

Para produção, considere:

1. **Segurança**: Use variáveis de ambiente seguras e não commite arquivos sensíveis
2. **HTTPS**: Configure um proxy reverso (Nginx/Traefik) com SSL
3. **Banco de Dados**: Se migrar para um banco de dados tradicional, adicione um serviço no docker-compose
4. **Monitoramento**: Adicione serviços de monitoramento e logging
5. **Backup**: Configure backups regulares do Firebase

