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
