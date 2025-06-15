# Task Manager - Syonet

Projeto Fullstack para gerenciamento de Usuários e Tarefas, com backend em Quarkus (Java), frontend em React + TypeScript.

## Tecnologias utilizadas
 - Backend: Quarkus (Java 21)
 - Frontend: React + TypeScript (Vite) + MUI Material
 - Banco de dados: PostgreSQL
 - Docker + Docker Compose
 - Gerenciadores de dependências: Maven (backend), npm (frontend)

## Funcionalidades

### Autenticação:
- Registro e login com feedbacks
- Log out
- **AcessToken** e **RefreshToken**
- Perfil de **User** e **Admin**

### Usuários:
- Usuários podem ser criados, editados e excluídos
- **Usuário admin pode ver, editar e deletar outros usuários**
- A adição de um usuário é feita através do formulário de registro
 
 ### Tarefas
 - Tarefas podem ser criadas, editadas, filtradas e excluídas
- Apenas o usuário **admin** pode **excluir** tarefas
- Usuário **admin** pode atribuir tarefas a outros usuários
- Usuário **admin** pode ver e editar todas as tarefas
- Usuário comum pode ver e editar apenas as suas tarefas

### Filtro
 - Filtro por data de entrega, status, nome e responsável
 - Apenas o usuário **admin** pode filtrar tarefas por responsável

## Como rodar o projeto
### Ambiente local:
#### Backend:
 - Acessar a pasta backend com `cd backend`
 - Instalar dependências e compilar o projeto com `./mvnw clean install package`
 - Executar o projeto com `./mvnw quarkus:dev`
 - O backend deverá executar na porta **8080**

#### Frontend
- Retornar para raiz do projeto com `cd ..`
- Acessar a pasta frontend com `cd frontend`
- Rodar `npm install` e `npm run build` para instalar dependências e compilar o projeto
- Rodar `npm run dev` para iniciar o projeto
- O frontend deverá executar na porta **5173**

### Observações
- Há um insert de usuário admin padrão no projeto, com email: **admin@gmail.com** e senha **12345**, assim como um usuário **User TaskManager**, ambos serão necessários para executar os testes Cypress
- Se ocorrer algum erro no insert inicial, ao realizar o registro sem nenhum usuário no banco de dados, o primeiro usuário por padrão sempre será **admin**
- Apenas o usuário admin pode atribuir tarefas a outros usuários e excluir tarefas, além de listar, excluir e editar outros usuários

### Docker (ou script shell)
- Docker: na raiz no projeto, rodar `docker compose up -d --build`
- Script: na raiz do projeto, rodar `sh start-docker.sh`
- O frontend deverá executar na porta **3000**

## Testes
### Backend
- Para executar os testes do backend, basta acessar a pasta `backend` com `cd backend` na raiz do projeto, e rodar `./mvnw test`
- Para os testes do backend, o banco utilizado é o `taskdb_test`, configurado no `application.properties` dos testes

### Frontend
- Para executar os testes do frontend, é necessário ter o projeto local rodando (frontend e backend)
- Acessar a pasta `frontend` com `cd frontend` na raiz do projeto, e rodar `npx cypress run`