# Plataforma de Divulgação de TCC

Este projeto foi desenvolvido como parte da disciplina **Desenvolvimento Web II**, com o objetivo de criar uma plataforma onde alunos possam **publicar, visualizar e compartilhar seus Trabalhos de Conclusão de Curso (TCCs)**.  
A aplicação é dividida em duas partes principais: **Front-end (ReactJS)** e **Back-end (AdonisJS com Firebase)**.

---

## Estrutura do Projeto

A arquitetura está dividida em duas camadas principais:

plataforma-divulgacao-tcc/
├── frontend/ # Aplicação ReactJS (interface do usuário)
│ ├── src/
│ │ ├── components/ # Componentes reutilizáveis
│ │ ├── pages/ # Páginas do site
│ │ ├── services/ # Comunicação com a API
│ │ └── styles/ # Estilos e temas
│ └── package.json
│
├── backend/ # API desenvolvida com AdonisJS
│ ├── app/
│ │ ├── Controllers/ # Controladores das rotas
│ │ ├── Models/ # Modelos de dados (Firebase)
│ │ └── Validators/ # Validações de entrada
│ ├── config/ # Configuração do Firebase e servidor
│ └── package.json
│
└── README.md
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

### Desenvolvido por

Cauê
João
João
Matheus Felipe Prudente (PC3025543)

Disciplina: Desenvolvimento Web II
Curso: Engenharia de Computação
Ano: 2025 - 8° Semestre