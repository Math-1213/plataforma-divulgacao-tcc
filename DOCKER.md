# Guia Docker - Plataforma de Divulgação de TCC

## O que é Docker?

**Docker** é uma plataforma de containerização que permite empacotar aplicações e suas dependências em containers isolados. É como uma "caixa" que contém tudo que sua aplicação precisa para funcionar.

### Principais Benefícios:

1. **Isolamento**: Cada container roda de forma independente, sem interferir em outros
2. **Portabilidade**: Funciona igual em qualquer máquina (Windows, Mac, Linux, servidores)
3. **Consistência**: Garante que todos os desenvolvedores usem o mesmo ambiente
4. **Facilidade de Deploy**: Simplifica muito a implantação em produção
5. **Versionamento**: Você pode versionar o ambiente junto com o código

### Conceitos Importantes:

- **Dockerfile**: Receita que define como construir uma imagem
- **Imagem**: Template imutável usado para criar containers
- **Container**: Instância executável de uma imagem
- **Docker Compose**: Ferramenta para orquestrar múltiplos containers

---

## Como Usar Docker neste Projeto

### Pré-requisitos

1. Instale o Docker Desktop:
   - **Windows/Mac**: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
   - **Linux**: `sudo apt-get install docker.io docker-compose`

2. Verifique a instalação:
   ```bash
   docker --version
   docker-compose --version
   ```

### Estrutura dos Arquivos Docker

```
plataforma-divulgacao-tcc/
├── backend/
│   └── Dockerfile          # Configuração do container do backend
├── frontend/
│   └── Dockerfile          # Configuração do container do frontend
├── docker-compose.yml      # Orquestra ambos os containers
└── .dockerignore          # Arquivos ignorados no build
```

---

## Comandos Principais

### 1. Construir e Iniciar os Containers

```bash
# Na raiz do projeto
docker-compose up --build
```

Este comando irá:
- Construir as imagens do backend e frontend
- Criar os containers
- Iniciar ambos os serviços

### 2. Iniciar em Background (Detached Mode)

```bash
docker-compose up -d
```

### 3. Parar os Containers

```bash
docker-compose down
```

### 4. Ver Logs

```bash
# Logs de todos os serviços
docker-compose logs

# Logs apenas do backend
docker-compose logs backend

# Logs apenas do frontend
docker-compose logs frontend

# Logs em tempo real
docker-compose logs -f
```

### 5. Reconstruir os Containers

```bash
# Reconstruir tudo
docker-compose up --build

# Reconstruir apenas um serviço
docker-compose up --build backend
```

### 6. Executar Comandos Dentro dos Containers

```bash
# Acessar o container do backend
docker-compose exec backend sh

# Acessar o container do frontend
docker-compose exec frontend sh

# Executar um comando específico
docker-compose exec backend npm run build
```

---

## Acessando a Aplicação

Após iniciar os containers:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3333

---

## Configuração de Variáveis de Ambiente

### Backend

Crie um arquivo `.env` na pasta `backend/` com:

```env
NODE_ENV=development
PORT=3333
HOST=0.0.0.0
APP_KEY=sua-chave-aqui
LOG_LEVEL=info
```

### Frontend

Crie um arquivo `.env` na pasta `frontend/` com:

```env
REACT_APP_LOCAL_URL=http://localhost:3333
REACT_APP_URL=http://localhost:3333
```

**Nota**: O arquivo `serviceAccountKey.json` do Firebase deve estar na pasta `backend/` para que o backend funcione corretamente.

---

## Desenvolvimento com Hot Reload

Os volumes configurados no `docker-compose.yml` permitem que as alterações no código sejam refletidas automaticamente nos containers:

- **Backend**: Alterações em arquivos `.ts` serão detectadas pelo AdonisJS
- **Frontend**: Alterações em arquivos React serão detectadas pelo webpack

---

## Troubleshooting

### Problema: Porta já em uso

```bash
# Verificar qual processo está usando a porta
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Ou altere as portas no docker-compose.yml
```

### Problema: Containers não iniciam

```bash
# Verificar logs de erro
docker-compose logs

# Reconstruir do zero
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Problema: Dependências não instaladas

```bash
# Reinstalar dependências dentro do container
docker-compose exec backend npm install
docker-compose exec frontend npm install
```

### Limpar tudo (cuidado!)

```bash
# Remove containers, volumes e imagens
docker-compose down -v --rmi all
```

---

## Produção

Para produção, você pode criar Dockerfiles otimizados com multi-stage builds. Exemplo:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY package*.json ./
RUN npm ci --only=production
CMD ["npm", "start"]
```

---

## Recursos Adicionais

- [Documentação Docker](https://docs.docker.com/)
- [Docker Compose Guide](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

