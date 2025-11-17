import express from 'express';
import { handleCreateUser, GetAllUsers, Login } from '../controllers/user.controller';
import { authenticateToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

// === 🌍 ROTAS PÚBLICAS ===

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: '📝 Criar nova conta de usuário'
 *     description: 'Registra um novo usuário no sistema. Não requer autenticação.'
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - phone
 *               - password
 *               - type
 *             properties:
 *               nome:
 *                 type: string
 *                 description: 'Nome completo do usuário'
 *                 example: 'João Silva'
 *               phone:
 *                 type: string
 *                 description: 'Telefone (10 ou 11 dígitos)'
 *                 example: '31999999999'
 *               password:
 *                 type: string
 *                 description: 'Senha (mínimo 6 caracteres)'
 *                 example: 'senha123'
 *               type:
 *                 type: string
 *                 enum: ['CLIENT', 'ADMIN']
 *                 description: 'Tipo de usuário'
 *                 example: 'CLIENT'
 *     responses:
 *       '201':
 *         description: 'Usuário criado com sucesso'
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
 *                   example: 'Usuário criado com sucesso'
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       '400':
 *         description: 'Dados inválidos ou usuário já existe'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '409':
 *         description: 'Telefone já está cadastrado'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Este telefone já está cadastrado'
 */
router.post('/create', handleCreateUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: '🔐 Fazer login no sistema'
 *     description: 'Autentica usuário e retorna token JWT para acesso às rotas protegidas'
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 description: 'Telefone de cadastro'
 *                 example: '31999999999'
 *               password:
 *                 type: string
 *                 description: 'Senha do usuário'
 *                 example: 'senha123'
 *     responses:
 *       '200':
 *         description: 'Login realizado com sucesso'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Login realizado com sucesso'
 *                 token:
 *                   type: string
 *                   description: 'Token JWT para autenticação'
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: '1'
 *                     nome:
 *                       type: string
 *                       example: 'João Silva'
 *                     type:
 *                       type: string
 *                       enum: ['CLIENT', 'ADMIN']
 *                       example: 'CLIENT'
 *       '401':
 *         description: 'Credenciais inválidas'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Credenciais inválidas'
 */
router.post('/login', Login);

// === 🔐 ROTAS PROTEGIDAS (ADMIN APENAS) ===

/**
 * @swagger
 * /users:
 *   get:
 *     summary: '📋 Listar todos os usuários'
 *     description: 'Lista todos os usuários cadastrados. Requer permissão de administrador.'
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: 'Lista de usuários'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: '1'
 *                   nome:
 *                     type: string
 *                     example: 'João Silva'
 *                   phone:
 *                     type: string
 *                     example: '31999999999'
 *                   type:
 *                     type: string
 *                     enum: ['CLIENT', 'ADMIN']
 *                     example: 'CLIENT'
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: '2024-11-20T10:30:00Z'
 *       '401':
 *         description: 'Token inválido ou ausente'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: 'Acesso negado - Apenas administradores'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticateToken, checkRole('ADMIN'), GetAllUsers);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: '👤 Ver meu perfil'
 *     description: 'Retorna informações do perfil do usuário logado'
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: 'Perfil do usuário'
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
 *                   example: 'Perfil encontrado'
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: '1'
 *                     type:
 *                       type: string
 *                       enum: ['CLIENT', 'ADMIN']
 *                       example: 'CLIENT'
 *       '401':
 *         description: 'Token inválido ou ausente'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/profile', authenticateToken, (req, res) => {
  const userToken = (req as any).user;
  res.json({
    success: true,
    message: 'Perfil encontrado',
    data: {
      id: userToken.id,
      type: userToken.type
    }
  });
});

export default router;