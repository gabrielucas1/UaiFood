import swaggerJsdoc from 'swagger-jsdoc';

const options: any = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🍽️ UaiFood API',
      version: '1.0.0',
      description: `
        ## 📖 Sistema de Delivery - Comida Mineira
        
        API completa para delivery de comida tradicional mineira, desenvolvida para DAW2.
        
        ### 🚀 Funcionalidades:
        - 👥 **Autenticação JWT** com níveis de acesso
        - 🏷️ **Gestão de Categorias** (Admin)
        - 🍽️ **Cardápio Digital** com preços
        - 📍 **Endereços de Entrega**
        - 🛒 **Sistema de Pedidos**
        
        ### 🔐 Autenticação:
        Use o token JWT no header: \`Authorization: Bearer {token}\`
        
        ### 👥 Níveis de Usuário:
        - **CLIENT**: Cliente normal (pode fazer pedidos)
        - **ADMIN**: Administrador (pode gerenciar cardápio)
      `,
      contact: {
        name: 'Equipe UaiFood',
        email: 'uaifood@daw2.edu'
      }
    },
    servers: [
      {
        url: 'http://localhost:3991/api',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    
    tags: [
      {
        name: 'Users',
        description: '👥 Gestão de usuários e autenticação'
      },
      {
        name: 'Categories',
        description: '🏷️ Gestão das categorias do cardápio (Admin)'
      },
      {
        name: 'Items',
        description: '🍽️ Gestão dos itens do cardápio'
      },
      {
        name: 'Addresses',
        description: '📍 Gestão de endereços de entrega'
      },
      {
        name: 'Orders',
        description: '🛒 Sistema de pedidos e carrinho'
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT no formato: Bearer {seu-token}'
        }
      },
      
      schemas: {
        // 👤 Schema do Usuário
        User: {
          type: 'object',
          properties: {
            id: { 
              type: 'string', 
              description: 'ID único do usuário',
              example: '1'
            },
            nome: { 
              type: 'string', 
              description: 'Nome completo do usuário',
              example: 'João Silva' 
            },
            phone: { 
              type: 'string', 
              description: 'Telefone para contato (10 ou 11 dígitos)',
              example: '31999999999' 
            },
            type: { 
              type: 'string', 
              enum: ['CLIENT', 'ADMIN'], 
              description: 'Tipo de usuário',
              example: 'CLIENT' 
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Data de criação do usuário' 
            }
          },
          required: ['nome', 'phone', 'password', 'type']
        },
        
        // 🏷️ Schema da Categoria
        Category: {
          type: 'object',
          properties: {
            id: { 
              type: 'string', 
              description: 'ID único da categoria',
              example: '1' 
            },
            description: { 
              type: 'string', 
              description: 'Descrição/nome da categoria',
              example: 'Pratos Principais' 
            }
          },
          required: ['description']
        },
        
        // 🍽️ Schema do Item
        Item: {
          type: 'object',
          properties: {
            id: { 
              type: 'string', 
              description: 'ID único do item',
              example: '1' 
            },
            description: { 
              type: 'string', 
              description: 'Descrição do prato',
              example: 'Pão de Açúcar Tradicional com Queijo Minas' 
            },
            unitPrice: { 
              type: 'number', 
              format: 'decimal', 
              description: 'Preço unitário do item',
              example: 15.90 
            },
            categoryId: { 
              type: 'string', 
              description: 'ID da categoria do item',
              example: '1' 
            },
            category: { 
              $ref: '#/components/schemas/Category' 
            }
          },
          required: ['description', 'unitPrice', 'categoryId']
        },
        
        // 📍 Schema do Endereço
        Address: {
          type: 'object',
          properties: {
            id: { 
              type: 'string',
              description: 'ID único do endereço',
              example: '1'
            },
            street: { 
              type: 'string', 
              description: 'Nome da rua',
              example: 'Rua das Flores' 
            },
            number: { 
              type: 'string', 
              description: 'Número da residência',
              example: '123' 
            },
            district: { 
              type: 'string', 
              description: 'Bairro',
              example: 'Centro' 
            },
            city: { 
              type: 'string', 
              description: 'Cidade',
              example: 'Belo Horizonte' 
            },
            state: { 
              type: 'string', 
              description: 'Estado (sigla)',
              example: 'MG' 
            },
            zipCode: { 
              type: 'string', 
              description: 'CEP',
              example: '30100-000' 
            }
          },
          required: ['street', 'number', 'district', 'city', 'state', 'zipCode']
        },
        
        // 🛒 Schema do Pedido
        Order: {
          type: 'object',
          properties: {
            id: { 
              type: 'string',
              description: 'ID único do pedido',
              example: '1'
            },
            paymentMethod: { 
              type: 'string', 
              enum: ['CASH', 'DEBIT', 'CREDIT', 'PIX'],
              description: 'Método de pagamento',
              example: 'PIX'
            },
            status: { 
              type: 'string', 
              description: 'Status do pedido',
              example: 'PENDING' 
            },
            total: {
              type: 'number',
              format: 'decimal',
              description: 'Valor total do pedido',
              example: 45.80
            },
            clientId: {
              type: 'string',
              description: 'ID do cliente que fez o pedido',
              example: '1'
            },
            createdById: {
              type: 'string',
              description: 'ID do usuário que criou o pedido',
              example: '1'
            },
            orderItems: {
              type: 'array',
              description: 'Itens do pedido',
              items: {
                $ref: '#/components/schemas/OrderItem'
              }
            }
          },
          required: ['paymentMethod', 'clientId', 'orderItems']
        },

        // 🛒 Schema do Item do Pedido
        OrderItem: {
          type: 'object',
          properties: {
            quantity: { 
              type: 'integer', 
              minimum: 1, 
              description: 'Quantidade do item',
              example: 2 
            },
            orderId: { 
              type: 'string', 
              description: 'ID do pedido',
              example: '1' 
            },
            itemId: { 
              type: 'string', 
              description: 'ID do item',
              example: '1' 
            },
            item: {
              $ref: '#/components/schemas/Item'
            }
          },
          required: ['quantity', 'itemId']
        },
        
        // ❌ Schema de Erro
        Error: {
          type: 'object',
          properties: {
            error: { 
              type: 'string', 
              example: 'Mensagem de erro' 
            },
            details: { 
              type: 'string', 
              example: 'Detalhes específicos do erro' 
            }
          }
        },

        // ✅ Schema de Sucesso
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
        }
      }
    }
  },
  apis: ['./backend/src/routes/*.ts'] // Caminho para os arquivos de rotas
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;