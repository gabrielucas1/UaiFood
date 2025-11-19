import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UaiFood API',
      version: '1.0.0',
      description: `
# 🍽️ UaiFood - Sistema de Delivery

API completa para sistema de delivery de comida tradicional mineira.

## 🚀 Funcionalidades:
- ✅ **Autenticação JWT** com níveis de acesso
- 👥 **Gestão de Usuários** (Cliente/Admin)  
- 🏪 **Gestão de Categorias** (Admin)
- 🍔 **Gestão de Itens** do cardápio (Admin)
- 📍 **Endereços de entrega**
- 🛒 **Sistema de Pedidos** completo

## 🔐 Autenticação:
Use o token JWT no header: **Authorization: Bearer {token}**

## 🎯 Níveis de Usuário:
- **CLIENT**: Cliente normal (pode fazer pedidos)
- **ADMIN**: Administrador (pode gerenciar cardápio)
      `,
      contact: {
        name: 'Equipe UaiFood',
        email: 'contato@uaifood.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3991/api',
        description: '🔧 Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do endpoint /users/login'
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Mensagem de erro'
            },
            details: {
              type: 'array',
              items: {
                type: 'object'
              },
              description: 'Detalhes adicionais do erro (quando aplicável)'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso'
            },
            data: {
              type: 'object',
              description: 'Dados retornados pela operação'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1' },
            nome: { type: 'string', example: 'João Silva' },
            phone: { type: 'string', example: '31999999999' },
            type: { type: 'string', enum: ['CLIENT', 'ADMIN'], example: 'CLIENT' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1' },
            description: { type: 'string', example: 'Pratos Principais' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Item: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1' },
            description: { type: 'string', example: 'Pão de Açúcar Tradicional' },
            unitPrice: { type: 'number', example: 15.90 },
            categoryId: { type: 'string', example: '1' }
          }
        },
        Address: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1' },
            street: { type: 'string', example: 'Rua das Flores' },
            number: { type: 'string', example: '123' },
            district: { type: 'string', example: 'Centro' },
            city: { type: 'string', example: 'Belo Horizonte' },
            state: { type: 'string', example: 'MG' },
            zipCode: { type: 'string', example: '30100-000' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1' },
            paymentMethod: { type: 'string', enum: ['CASH', 'DEBIT', 'CREDIT', 'PIX'] },
            status: { type: 'string', enum: ['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'] },
            total: { type: 'number', example: 45.80 },
            clientId: { type: 'string', example: '1' }
          }
        },
        PaymentMethod: {
          type: 'string',
          enum: ['CASH', 'DEBIT', 'CREDIT', 'PIX'],
          description: 'Método de pagamento aceito',
          example: 'PIX'
        },
        OrderStatus: {
          type: 'string',
          enum: ['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'],
          description: 'Status atual do pedido',
          example: 'PENDING'
        },
        UserType: {
          type: 'string',
          enum: ['CLIENT', 'ADMIN'],
          description: 'Tipo de usuário no sistema',
          example: 'CLIENT'
        }
      }
    },
    tags: [
      {
        name: 'Users',
        description: '👥 Gestão de usuários e autenticação'
      },
      {
        name: 'Categories', 
        description: '🏪 Gestão das categorias do cardápio (Admin)'
      },
      {
        name: 'Items',
        description: '🍔 Gestão dos itens do cardápio (Admin)'
      },
      {
        name: 'Addresses',
        description: '📍 Gestão de endereços de entrega'
      },
      {
        name: 'Orders',
        description: '🛒 Sistema de pedidos e carrinho'
      }
    ]
  },
  // CORREÇÃO: Caminho correto dos arquivos
  apis: ['./src/routes/*.ts'], // ERA: './backend/src/routes/*.ts'
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;