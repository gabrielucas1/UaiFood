// backend/src/routes/item.routes.ts - COM COMENTÁRIOS SWAGGER

import express from 'express';
import { 
  handleCreateItem, 
  handleGetAllItems, 
  handleUpdateItem, 
  handleDeleteItem 
} from '../controllers/item.controller';
import { authenticateToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

// === 🌍 ROTAS PÚBLICAS ===

/**
 * @swagger
 * /items:
 *   get:
 *     summary: '🍽️ Listar todos os itens do cardápio'
 *     description: 'Lista todos os itens disponíveis no cardápio com suas categorias. Rota pública para visualização do menu.'
 *     tags:
 *       - Items
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: number
 *         description: 'Filtrar itens por categoria específica'
 *         example: 1
 *         required: false
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 'Buscar itens por nome/descrição'
 *         example: 'Pizza'
 *         required: false
 *     responses:
 *       '200':
 *         description: 'Lista de itens do cardápio retornada com sucesso'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Item'
 *                   - type: object
 *                     properties:
 *                       category:
 *                         $ref: '#/components/schemas/Category'
 *             example:
 *               - id: 1
 *                 description: "Pizza de Pepperoni Tradicional"
 *                 unitPrice: 55.90
 *                 categoryId: 1
 *                 category:
 *                   id: 1
 *                   name: "Pizzas"
 *                   description: "Pizzas artesanais"
 *               - id: 2
 *                 description: "Pão de Açúcar com Queijo Minas"
 *                 unitPrice: 15.90
 *                 categoryId: 2
 *                 category:
 *                   id: 2
 *                   name: "Pratos Principais"
 *                   description: "Pratos tradicionais mineiros"
 *       '500':
 *         description: 'Erro interno do servidor'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', handleGetAllItems);

// === 🔒 ROTAS PROTEGIDAS (ADMIN) ===

/**
 * @swagger
 * /items:
 *   post:
 *     summary: '➕ Criar novo item do cardápio (ADMIN)'
 *     description: 'Adiciona um novo item ao cardápio do restaurante. Requer permissão de ADMIN.'
 *     tags:
 *       - Items
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - unitPrice
 *               - categoryId
 *             properties:
 *               description:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: 'Pizza de Pepperoni Tradicional'
 *                 description: 'Nome/descrição do item'
 *               unitPrice:
 *                 type: number
 *                 format: decimal
 *                 minimum: 0.01
 *                 example: 55.90
 *                 description: 'Preço unitário do item em reais'
 *               categoryId:
 *                 type: number
 *                 example: 1
 *                 description: 'ID da categoria à qual o item pertence'
 *           example:
 *             description: "Pizza de Pepperoni Tradicional"
 *             unitPrice: 55.90
 *             categoryId: 1
 *     responses:
 *       '201':
 *         description: 'Item criado com sucesso'
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
 *                   example: 'Item criado com sucesso'
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Item'
 *                     - type: object
 *                       properties:
 *                         category:
 *                           $ref: '#/components/schemas/Category'
 *       '400':
 *         description: 'Dados inválidos ou categoria não existe'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validation_error:
 *                 summary: 'Erro de validação'
 *                 value:
 *                   error: 'Dados inválidos'
 *                   details: 'Preço deve ser maior que zero'
 *               category_not_found:
 *                 summary: 'Categoria inexistente'
 *                 value:
 *                   error: 'Categoria não encontrada'
 *                   details: 'A categoria informada não existe'
 *       '401':
 *         description: 'Token inválido ou ausente'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: 'Acesso negado - Requer permissão ADMIN'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateToken, checkRole('ADMIN'), handleCreateItem);

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: '✏️ Atualizar item do cardápio (ADMIN)'
 *     description: 'Atualiza preço, descrição ou categoria de um item existente. Requer permissão de ADMIN.'
 *     tags:
 *       - Items
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do item a ser atualizado'
 *         example: '1'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: 'Pizza de Pepperoni Premium'
 *               unitPrice:
 *                 type: number
 *                 format: decimal
 *                 minimum: 0.01
 *                 example: 59.90
 *               categoryId:
 *                 type: number
 *                 example: 1
 *           example:
 *             description: "Pizza de Pepperoni Premium"
 *             unitPrice: 59.90
 *             categoryId: 1
 *     responses:
 *       '200':
 *         description: 'Item atualizado com sucesso'
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
 *                   example: 'Item atualizado com sucesso'
 *                 data:
 *                   $ref: '#/components/schemas/Item'
 *       '400':
 *         description: 'Dados inválidos'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '401':
 *         description: 'Token inválido ou ausente'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: 'Acesso negado - Requer permissão ADMIN'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: 'Item não encontrado'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticateToken, checkRole('ADMIN'), handleUpdateItem);

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: '🗑️ Deletar item do cardápio (ADMIN)'
 *     description: 'Remove um item do cardápio permanentemente. Requer permissão de ADMIN.'
 *     tags:
 *       - Items
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do item a ser deletado'
 *         example: '1'
 *     responses:
 *       '204':
 *         description: 'Item deletado com sucesso'
 *       '401':
 *         description: 'Token inválido ou ausente'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: 'Acesso negado - Requer permissão ADMIN'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: 'Item não encontrado'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '409':
 *         description: 'Item possui pedidos vinculados e não pode ser deletado'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Não é possível deletar o item'
 *                 details:
 *                   type: string
 *                   example: 'Este item possui pedidos vinculados'
 */
router.delete('/:id', authenticateToken, checkRole('ADMIN'), handleDeleteItem);

export default router;