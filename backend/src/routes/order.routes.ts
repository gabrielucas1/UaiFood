import express from 'express';
import { handleCreateOrder, handleGetAllOrders, handleGetMyOrders, handleUpdateOrderStatus } from '../controllers/order.controller';
import { authenticateToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

// === 🔒 ROTAS PROTEGIDAS (USUÁRIO LOGADO) ===

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: '🛒 Criar novo pedido'
 *     description: 'Cria um novo pedido com itens do cardápio. Requer usuário autenticado e endereço cadastrado.'
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *               - items
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: ['CASH', 'DEBIT', 'CREDIT', 'PIX']
 *                 example: 'PIX'
 *                 description: 'Método de pagamento escolhido'
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 description: 'Lista de itens do pedido'
 *                 items:
 *                   type: object
 *                   required:
 *                     - itemId
 *                     - quantity
 *                   properties:
 *                     itemId:
 *                       type: number
 *                       example: 1
 *                       description: 'ID do item do cardápio'
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       maximum: 99
 *                       example: 2
 *                       description: 'Quantidade do item'
 *           example:
 *             paymentMethod: "PIX"
 *             items:
 *               - itemId: 1
 *                 quantity: 2
 *               - itemId: 3
 *                 quantity: 1
 *     responses:
 *       '201':
 *         description: 'Pedido criado com sucesso'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Pedido criado com sucesso'
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Order'
 *                     - type: object
 *                       properties:
 *                         orderItems:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               quantity:
 *                                 type: integer
 *                               unitPrice:
 *                                 type: number
 *                               item:
 *                                 $ref: '#/components/schemas/Item'
 *             example:
 *               success: true
 *               message: "Pedido criado com sucesso"
 *               data:
 *                 id: "cm3p7r2kl0002j3k5f2g7h8i9"
 *                 paymentMethod: "PIX"
 *                 status: "PENDING"
 *                 totalAmount: 45.80
 *                 orderItems:
 *                   - id: "item1"
 *                     quantity: 2
 *                     unitPrice: 15.90
 *                     item:
 *                       id: 1
 *                       description: "Pão de Açúcar Tradicional"
 *                       unitPrice: 15.90
 *                   - id: "item2"
 *                     quantity: 1
 *                     unitPrice: 14.00
 *                     item:
 *                       id: 3
 *                       description: "Refrigerante Guaraná"
 *                       unitPrice: 14.00
 *       '400':
 *         description: 'Dados inválidos ou itens não encontrados'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validation_error:
 *                 summary: 'Erro de validação'
 *                 value:
 *                   error: 'Dados inválidos'
 *                   details: 'Quantidade deve ser maior que zero'
 *               item_not_found:
 *                 summary: 'Item não encontrado'
 *                 value:
 *                   error: 'Item não encontrado'
 *                   details: 'Um ou mais itens do pedido não existem'
 *               empty_cart:
 *                 summary: 'Carrinho vazio'
 *                 value:
 *                   error: 'Carrinho vazio'
 *                   details: 'Adicione pelo menos um item ao pedido'
 *       '401':
 *         description: 'Token inválido ou ausente'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: 'Endereço não cadastrado'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Endereço não encontrado"
 *               details: "Cadastre um endereço antes de fazer pedidos"
 */
router.post('/', authenticateToken, handleCreateOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: '📋 Listar pedidos'
 *     description: |
 *       Lista pedidos com base no tipo de usuário:
 *       - **ADMIN**: Vê todos os pedidos do sistema
 *       - **CLIENT**: Vê apenas seus próprios pedidos
 *       
 *       Os pedidos são retornados ordenados do mais recente para o mais antigo.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED']
 *         description: 'Filtrar pedidos por status'
 *         example: 'PENDING'
 *         required: false
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 'Número da página (paginação)'
 *         example: 1
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: 'Quantidade de pedidos por página'
 *         example: 10
 *         required: false
 *     responses:
 *       '200':
 *         description: 'Lista de pedidos retornada com sucesso'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Pedidos encontrados'
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Order'
 *                       - type: object
 *                         properties:
 *                           client:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                           address:
 *                             $ref: '#/components/schemas/Address'
 *                           orderItems:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 quantity:
 *                                   type: integer
 *                                 unitPrice:
 *                                   type: number
 *                                 item:
 *                                   $ref: '#/components/schemas/Item'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current:
 *                       type: integer
 *                       example: 1
 *                     total:
 *                       type: integer
 *                       example: 5
 *                     hasNext:
 *                       type: boolean
 *                       example: true
 *                     hasPrev:
 *                       type: boolean
 *                       example: false
 *             examples:
 *               admin_view:
 *                 summary: 'Visão do ADMIN (todos os pedidos)'
 *                 value:
 *                   success: true
 *                   message: "Pedidos encontrados"
 *                   data:
 *                     - id: "order1"
 *                       paymentMethod: "PIX"
 *                       status: "PENDING"
 *                       totalAmount: 45.80
 *                       client:
 *                         name: "João Silva"
 *                         email: "joao@email.com"
 *                       address:
 *                         street: "Rua A, 123"
 *                         neighborhood: "Centro"
 *                       orderItems: []
 *                     - id: "order2"
 *                       paymentMethod: "CREDIT"
 *                       status: "DELIVERED"
 *                       totalAmount: 32.50
 *                       client:
 *                         name: "Maria Santos"
 *                         email: "maria@email.com"
 *               client_view:
 *                 summary: 'Visão do CLIENT (apenas seus pedidos)'
 *                 value:
 *                   success: true
 *                   message: "Seus pedidos"
 *                   data:
 *                     - id: "order1"
 *                       paymentMethod: "PIX"
 *                       status: "PENDING"
 *                       totalAmount: 45.80
 *                       orderItems:
 *                         - quantity: 2
 *                           unitPrice: 15.90
 *                           item:
 *                             description: "Pão de Açúcar"
 *       '401':
 *         description: 'Token inválido ou ausente'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: 'Acesso negado (muito raro, mas possível)'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/my-orders', authenticateToken, handleGetMyOrders);
router.get('/', authenticateToken, handleGetAllOrders);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: '🔄 Atualizar status do pedido (ADMIN)'
 *     description: 'Atualiza o status de um pedido específico. Requer permissão de ADMIN.'
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do pedido'
 *         example: '1'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED']
 *                 example: 'PREPARING'
 *           example:
 *             status: "PREPARING"
 *     responses:
 *       '200':
 *         description: 'Status atualizado com sucesso'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       '403':
 *         description: 'Acesso negado - Requer permissão ADMIN'
 *       '404':
 *         description: 'Pedido não encontrado'
 */
router.patch('/:id/status', authenticateToken, checkRole('ADMIN'), handleUpdateOrderStatus);

export default router;