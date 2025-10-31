<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="50" alt="Nest Logo" /></a>
</p>

## Hypewear-Backend

**HypeWear**, é uma aplicação web que simula uma loja virtual, este presente projeto é o back-end do sistema. Uma API desenvolvida com **NestJS** e **Prisma**, voltada para o gerenciamento de clientes, produtos, pedidos, endereços e pagamentos.  
A API utiliza **JWT** para autenticação e **Swagger** para documentação interativa. 
Você encontra o front-end em: https://github.com/danilo-humberto/hypewear

## Ferramentas do projeto

```
# NestJS (Framework de Backend)
# Prisma (ORM para comunicação com o banco)
# PostgreSQL (Banco de dados relacional)
# Neon (Hospedagem Serverless do banco de dados)
# TypeScript
# Jest (Testes de unidade)
# bcrypt (Hashing de senhas)
# Swagger (Documentação)
# DTOs (Data Transfer Objects) com class-validator

```
## Como rodar o projeto

```bash
# Clone repositório
$ git clone https://github.com/danilo-humberto/hypewear-backend.git

# Entre na pasta
$ cd hypewear-backend

# Instale as dependências
$ npm install

# Crie seu arquivo .env na raiz
# (baseado no .env.example que deve existir no repositório)
# e adicione sua DATABASE_URL do Neon.

# Rode as migrações do Prisma
$ npx prisma migrate dev

# Gere o PrismaClient
$ npx prisma generate

# Rode o projeto
$ npm run start:dev
```

## Run tests

```bash
# Rodar testes
$ npm run test
```

## Rotas

Nossos endpoints

# API Documentation

## Autenticação (Auth)

### **POST /auth/login**
Realiza o login do cliente e retorna um token JWT.

### **POST /auth/register**
Registra um novo cliente (já com hash na senha) e retorna um token JWT.

---

## Clientes (Clients)

### **POST /clients**
Cria um novo cliente (usado pelo `/auth/register`).

### **GET /clients**
Retorna todos os clientes (sem a senha).

### **GET /clients/:id**
Busca um cliente específico por ID (com a senha).

### **PATCH /clients/:id**
Atualiza os dados de um cliente (pode incluir a senha, que será hasheada).

### **DELETE /clients/:id**
Remove um cliente.

---

## Produtos (Product)

### **POST /product**
Cria um novo produto (requer um `categoryId` válido).

### **GET /product**
Busca todos os produtos.  
Aceita filtros por *query params*:
- `?name=` (filtra por nome)  
- `?nameCategory=` (filtra por nome da categoria)  
- `?precoMin=` e `?precoMax=` (filtra por faixa de preço)

### **GET /product/:id**
Busca um produto específico por ID.

### **PATCH /product/:id**
Atualiza um produto.

### **DELETE /product/:id**
Remove um produto.

---

## Endereços (Address)

### **POST /addresss**
Cria um novo endereço para um cliente.  
Se `isDefault: true`, remove o padrão dos outros endereços.

### **GET /addresss**
Busca todos os endereços de todos os clientes.

### **GET /addresss/client/:id**
Busca todos os endereços de um cliente específico.

### **GET /addresss/:id**
Busca um endereço específico por ID.

### **PATCH /addresss/:id**
Atualiza um endereço.  
Se `isDefault: true`, remove o padrão dos outros.

### **PATCH /addresss/:id/default**
Define um endereço específico como o padrão do cliente.

### **DELETE /addresss/:id**
Remove um endereço.

---

## Pedidos (Order)

### **POST /orders**
Cria um novo pedido.  
Esta rota é complexa: verifica o cliente, o estoque de cada produto, e cria o pedido e os `OrderItems` em uma transação.

### **GET /orders**
Busca todos os pedidos.

### **GET /orders/:id**
Busca um pedido específico por ID.

---

## Pagamentos (Payment)

### **POST /payments**
Cria um novo pagamento para um pedido.  
Verifica se o pedido está **ABERTO** e se não há outro pagamento ativo.  
Define o status do pedido como **AGUARDANDO_PAGAMENTO**.

### **GET /payments**
Busca todos os pagamentos.

### **GET /payments/:id**
Busca um pagamento específico por ID.

### **PATCH /payments/:id/confirm**
Rota de simulação/Webhook.  
Confirma um pagamento **PENDENTE**, dá baixa no estoque e define o pedido como **PAGO**.

### **PATCH /payments/:id/cancel**
Cancela um pagamento (se não estiver **PAGO**) e reverte o status do pedido para **ABERTO**.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
