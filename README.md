<p align="center">
  <img width="80" height="80" alt="logo-light" src="https://github.com/user-attachments/assets/35b871f1-c5ed-4cf9-8d35-5741997cf787" />
</a>
</p>

## Hypewear-Backend

**HypeWear**, é uma aplicação web que simula uma loja virtual, este presente projeto é o back-end do sistema. Uma API desenvolvida com **NestJS** e **Prisma**, voltada para o gerenciamento de clientes, produtos, pedidos, endereços e pagamentos.  
A API utiliza **JWT** para autenticação e **Swagger** para documentação interativa. 
Você encontra o front-end em: https://github.com/danilo-humberto/hypewear

## Colaboradores
```
 # [Danilo Humberto](https://github.com/danilo-humberto)
 # [Leandro Silva](https://github.com/leandroxzq)
 # [Juliana Felix](https://github.com/feliixjuliana)
```
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

## API Documentation

## Autenticação (Auth)

```bash
# Realiza o login do cliente e retorna um token JWT
POST /auth/login

# Registra um novo cliente (já com hash na senha) e retorna um token JWT
POST /auth/register
```

---

## Clientes (Clients)

```bash
# Cria um novo cliente (usado pelo /auth/register)
POST /clients

# Retorna todos os clientes (sem a senha)
GET /clients

# Busca um cliente específico por ID (com a senha)
GET /clients/:id

# Atualiza os dados de um cliente (pode incluir a senha, que será hasheada)
PATCH /clients/:id

# Remove um cliente
DELETE /clients/:id
```

---

## Produtos (Product)

```bash
# Cria um novo produto (requer um categoryId válido)
POST /product

# Busca todos os produtos com filtros opcionais:
# ?name=, ?nameCategory=, ?precoMin=, ?precoMax=
GET /product

# Busca um produto específico por ID
GET /product/:id

# Atualiza um produto
PATCH /product/:id

# Remove um produto
DELETE /product/:id
```

---

## Endereços (Address)

```bash
# Cria um novo endereço para um cliente
# Se isDefault: true, remove o padrão dos outros endereços
POST /addresss

# Busca todos os endereços de todos os clientes
GET /addresss

# Busca todos os endereços de um cliente específico
GET /addresss/client/:id

# Busca um endereço específico por ID
GET /addresss/:id

# Atualiza um endereço (se isDefault: true, remove o padrão dos outros)
PATCH /addresss/:id

# Define um endereço específico como o padrão do cliente
PATCH /addresss/:id/default

# Remove um endereço
DELETE /addresss/:id
```

---

## Pedidos (Order)

```bash
# Cria um novo pedido
# Verifica o cliente, o estoque e cria o pedido com os OrderItems em transação
POST /orders

# Busca todos os pedidos
GET /orders

# Busca um pedido específico por ID
GET /orders/:id
```

---

## Pagamentos (Payment)

```bash
# Cria um novo pagamento para um pedido
# Verifica se o pedido está ABERTO e se não há outro pagamento ativo
POST /payments

# Busca todos os pagamentos
GET /payments

# Busca um pagamento específico por ID
GET /payments/:id

# Confirma um pagamento PENDENTE (Webhook)
# Dá baixa no estoque e define o pedido como PAGO
PATCH /payments/:id/confirm

# Cancela um pagamento (se não estiver PAGO)
# Reverte o status do pedido para ABERTO
PATCH /payments/:id/cancel
```

