# 🍽️ UaiFood - Sistema de Delivery 

## 📋 Descrição do Projeto
O **UaiFood** é um sistema completo de delivery de comida típica mineira, desenvolvido para a disciplina de **Desenvolvimento de Aplicações Web 2**. O projeto demonstra uma aplicação web moderna com autenticação, carrinho de compras e gerenciamento de pedidos.

---

## 🏗️ Arquitetura do Sistema

### **Backend** (API REST com Node.js)
- **Framework**: Express.js com TypeScript
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: Zod para validação de dados
- **Documentação**: Swagger/OpenAPI

### **Frontend** (Interface Web)
- **Framework**: Next.js 14 com React 18
- **Estilização**: TailwindCSS
- **Linguagem**: TypeScript
- **Hooks Customizados**: Para gerenciamento de estado

---

---

## 📁 Estrutura de Pastas Simplificada

```
UaiFood/
├── backend/                    # API do sistema
│   ├── src/
│   │   ├── controllers/        # Controladores (recebem requisições)
│   │   ├── services/          # Lógica de negócio
│   │   ├── middlewares/       # Autenticação e validações
│   │   ├── schema/            # Validação de dados
│   │   └── routes/            # Definição das rotas da API
│   └── prisma/                # Configuração do banco de dados
│
├── frontend/                   # Interface do usuário
│   └── src/app/
│       ├── components/        # Componentes reutilizáveis
│       ├── contexts/          # Gerenciamento global de estado
│       ├── home/             # Página inicial
│       ├── login/            # Sistema de autenticação
│       ├── order/            # Sistema de pedidos
│       └── admin/            # Painel administrativo
│
└── populate_database.sql      # Script para popular o banco



```

---

## 🗄️ Banco de Dados

### **Principais Tabelas:**
1. **Users** - Dados dos usuários (clientes e admins)
2. **Categories** - Categorias dos pratos (Hambúrgueres, Bebidas, etc.)
3. **Items** - Produtos do cardápio com preços
4. **Orders** - Pedidos realizados
5. **OrderItems** - Itens específicos de cada pedido
6. **Address** - Endereços de entrega dos clientes

### **Relacionamentos:**
- Um usuário pode ter vários pedidos
- Um pedido pode ter vários itens
- Cada item pertence a uma categoria

---

## 🚀 Tecnologias Utilizadas

### **Backend:**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de dados
- **Swagger** - Documentação da API

### **Frontend:**
- **Next.js 14** - Framework React
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Framework de CSS
- **Custom Hooks** - Gerenciamento de estado

--

---

## 🏃‍♂️ Como Executar

### **Pré-requisitos:**
- Node.js 18+
- PostgreSQL
- Yarn

### **Passos:**
1. Clone o repositório
2. Configure o banco PostgreSQL
3. Configure as variáveis de ambiente (.env)
4. Execute o backend: `cd backend && yarn dev`
5. Execute o frontend: `cd frontend && yarn dev`
6. Acesse: http://localhost:3001

---

**Desenvolvido por:** Gabriel  
**Disciplina:** Desenvolvimento de Aplicações Web 2  
**Período:** 5º Período - 2024