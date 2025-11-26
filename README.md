# Plataforma de Divulgação de TCC

Este projeto foi desenvolvido como parte da disciplina **Desenvolvimento Web II**, com o objetivo de criar uma plataforma onde alunos possam **publicar, visualizar e compartilhar seus Trabalhos de Conclusão de Curso (TCCs)**.  
A aplicação é dividida em duas partes principais: **Front-end (ReactJS)** e **Back-end (AdonisJS com Firebase)**.

---

## Estrutura do Projeto

A arquitetura está dividida em duas camadas principais:

plataforma-divulgacao-tcc/
- frontend/ # Aplicação ReactJS (interface do usuário)
- backend/ # API desenvolvida com AdonisJS
- docs/ # Modelos e Documentos Adicionais
- README.md
---

## Tecnologias Utilizadas

### **Front-end**
- ReactJS  
- React Router DOM  
- Redux / Context API (para gerenciamento de estado)  
- Bootstrap ou Material UI  

### **Back-end**
- Node.js  
- AdonisJS  
- Firebase (Firestore e Auth)  

---

## Como Clonar e Executar o Projeto

### Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/plataforma-divulgacao-tcc.git
cd plataforma-divulgacao-tcc
```
### Instalar Dependências
Front-end:
```bash
cd frontend
npm install
```
```bash
Back-end:
cd ../backend
npm install
```
### Executando o Projeto
Rodar a API (Back-end)
```bash
cd backend
node ace serve --watch
```

A API será iniciada em:
>http://localhost:3333

Rodar o Front-end
Em outro terminal:
```bash
cd frontend
npm start
```

O site abrirá em:
> http://localhost:3000

---

## Executando com Docker 🐳

### O que é Docker?

Docker é uma plataforma de containerização que permite empacotar sua aplicação e todas as suas dependências em containers isolados. Isso garante que a aplicação funcione da mesma forma em qualquer ambiente (desenvolvimento, produção, etc.).

**Principais benefícios:**
- ✅ Isolamento completo do ambiente
- ✅ Portabilidade entre diferentes sistemas
- ✅ Facilita o trabalho em equipe (mesmo ambiente para todos)
- ✅ Simplifica o deploy em produção

### Pré-requisitos

Instale o [Docker Desktop](https://www.docker.com/products/docker-desktop) no seu sistema.

### Executando com Docker

1. **Na raiz do projeto, execute:**
   ```bash
   docker-compose up --build
   ```

2. **Acesse a aplicação:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3333

3. **Para parar os containers:**
   ```bash
   docker-compose down
   ```

4. **Para ver os logs:**
   ```bash
   docker-compose logs -f
   ```

**📖 Para mais detalhes sobre Docker, consulte o arquivo [DOCKER.md](./DOCKER.md)**

---

### Configurando o Firebase

**Acesse Firebase Console**
.

Clique em Adicionar projeto e siga os passos para criar um novo projeto.

Habilite Firestore Database no modo Start in test mode (pode mudar depois para produção).

Habilite Authentication → Email/Password.

**Criar chave de serviço (Service Account)**

No Firebase Console, vá em Project Settings → Service Accounts.

Clique em Generate new private key.

Baixe o arquivo, renomei para serviceAccountKey.json e coloque na raiz do projeto backend (/backend).

### Desenvolvido por

Cauê
João
João
Matheus Felipe Prudente (PC3025543)

Disciplina: Desenvolvimento Web II
Curso: Engenharia de Computação
Ano: 2025 - 8° Semestre
