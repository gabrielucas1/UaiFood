import express from 'express';
import { 
  handleCreateCategory,
  handleDeleteCategory,
  handleGetAllCategories,
  handleGetCategoryById,
  handleUpdateCategory
} from '../controllers/category.controller';
import { authenticateToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

// === 🌍 ROTAS PÚBLICAS ===

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: '🏷️ Listar todas as categorias'
 *     description: 'Lista todas as categorias do cardápio. Rota pública.'
 *     tags:
 *       - Categories
 *     responses:
 *       '200':
 *         description: 'Lista de categorias'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       '500':
 *         description: 'Erro interno do servidor'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', handleGetAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: '🔍 Buscar categoria por ID'
 *     description: 'Retorna uma categoria específica pelo ID. Rota pública.'
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 'ID da categoria'
 *         example: 1
 *     responses:
 *       '200':
 *         description: 'Categoria encontrada'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '404':
 *         description: 'Categoria não encontrada'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', handleGetCategoryById);

// === 🔒 ROTAS PROTEGIDAS (ADMIN) ===

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: '➕ Criar nova categoria (ADMIN)'
 *     description: 'Cria uma nova categoria do cardápio. Requer permissão de ADMIN.'
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Pratos Principais'
 *               description:
 *                 type: string
 *                 example: 'Pratos tradicionais da culinária mineira'
 *     responses:
 *       '201':
 *         description: 'Categoria criada com sucesso'
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
 *                   example: 'Categoria criada com sucesso'
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       '400':
 *         description: 'Dados inválidos ou categoria já existe'
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
 */
router.post('/', authenticateToken, checkRole('ADMIN'), handleCreateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: '✏️ Atualizar categoria (ADMIN)'
 *     description: 'Atualiza uma categoria existente. Requer permissão de ADMIN.'
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 'ID da categoria'
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Bebidas Tradicionais'
 *               description:
 *                 type: string
 *                 example: 'Bebidas típicas de Minas Gerais'
 *     responses:
 *       '200':
 *         description: 'Categoria atualizada com sucesso'
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
 *                   example: 'Categoria atualizada com sucesso'
 *                 data:
 *                   $ref: '#/components/schemas/Category'
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
 *         description: 'Categoria não encontrada'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticateToken, checkRole('ADMIN'), handleUpdateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: '🗑️ Deletar categoria (ADMIN)'
 *     description: 'Remove uma categoria do sistema. Requer permissão de ADMIN.'
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 'ID da categoria'
 *         example: 1
 *     responses:
 *       '204':
 *         description: 'Categoria deletada com sucesso'
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
 *         description: 'Categoria não encontrada'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '409':
 *         description: 'Categoria possui itens vinculados e não pode ser deletada'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticateToken, checkRole('ADMIN'), handleDeleteCategory);

export default router;
