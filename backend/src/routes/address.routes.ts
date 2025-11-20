import express from 'express';
import { 
  handleCreateAddress, 
  handleGetAddress, 
  handleUpdateAddress, 
  handleDeleteAddress 
} from '../controllers/address.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// 🔒 Aplica autenticação a todas as sub-rotas
router.use(authenticateToken);

// === 🔐 ROTAS PROTEGIDAS (USUÁRIO LOGADO) ===

/**
 * @swagger
 * /address:
 *   post:
 *     summary: '📍 Criar meu endereço de entrega'
 *     description: 'Cria um endereço principal para o usuário logado. Cada usuário pode ter apenas um endereço.'
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - neighborhood
 *               - city
 *               - state
 *               - zipCode
 *             properties:
 *               street:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *                 example: 'Rua das Flores, 123, Apt 201'
 *                 description: 'Rua, número e complemento'
 *               neighborhood:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: 'Centro'
 *                 description: 'Bairro do endereço'
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: 'Belo Horizonte'
 *                 description: 'Cidade'
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 example: 'MG'
 *                 description: 'Estado (sigla com 2 letras)'
 *               zipCode:
 *                 type: string
 *                 pattern: '^[0-9]{5}-?[0-9]{3}$'
 *                 example: '30100-000'
 *                 description: 'CEP (formato: 00000-000 ou 00000000)'
 *           example:
 *             street: "Rua das Flores, 123, Apt 201"
 *             neighborhood: "Centro"
 *             city: "Belo Horizonte"
 *             state: "MG"
 *             zipCode: "30100-000"
 *     responses:
 *       '201':
 *         description: 'Endereço criado com sucesso'
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
 *                   example: 'Endereço criado com sucesso'
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *             example:
 *               success: true
 *               message: "Endereço criado com sucesso"
 *               data:
 *                 id: "cm3p7r2kl0001j3k5f2g7h8i9"
 *                 street: "Rua das Flores, 123, Apt 201"
 *                 neighborhood: "Centro"
 *                 city: "Belo Horizonte"
 *                 state: "MG"
 *                 zipCode: "30100-000"
 *                 clientId: "cm3p7r2kl0000j3k5f2g7h8i9"
 *       '400':
 *         description: 'Dados inválidos ou usuário já possui endereço'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validation_error:
 *                 summary: 'Erro de validação'
 *                 value:
 *                   error: 'Dados inválidos'
 *                   details: 'CEP deve ter formato 00000-000'
 *               already_exists:
 *                 summary: 'Endereço já existe'
 *                 value:
 *                   error: 'Endereço já existe'
 *                   details: 'Usuário já possui um endereço cadastrado'
 *       '401':
 *         description: 'Token inválido ou ausente'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', handleCreateAddress);

/**
 * @swagger
 * /address:
 *   get:
 *     summary: '📍 Ver meu endereço de entrega'
 *     description: 'Retorna o endereço cadastrado do usuário logado.'
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: 'Endereço encontrado com sucesso'
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
 *                   example: 'Endereço encontrado'
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *             example:
 *               success: true
 *               message: "Endereço encontrado"
 *               data:
 *                 id: "cm3p7r2kl0001j3k5f2g7h8i9"
 *                 street: "Rua das Flores, 123, Apt 201"
 *                 neighborhood: "Centro"
 *                 city: "Belo Horizonte"
 *                 state: "MG"
 *                 zipCode: "30100-000"
 *                 clientId: "cm3p7r2kl0000j3k5f2g7h8i9"
 *       '404':
 *         description: 'Usuário não possui endereço cadastrado'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Endereço não encontrado"
 *               details: "Usuário ainda não cadastrou um endereço"
 *       '401':
 *         description: 'Token inválido ou ausente'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', handleGetAddress);

/**
 * @swagger
 * /address:
 *   put:
 *     summary: '✏️ Atualizar meu endereço de entrega'
 *     description: 'Atualiza o endereço existente do usuário logado. Todos os campos são opcionais.'
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *                 example: 'Avenida Central, 456, Casa 2'
 *               neighborhood:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: 'Savassi'
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: 'Belo Horizonte'
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 example: 'MG'
 *               zipCode:
 *                 type: string
 *                 pattern: '^[0-9]{5}-?[0-9]{3}$'
 *                 example: '30112-000'
 *           example:
 *             street: "Avenida Central, 456, Casa 2"
 *             neighborhood: "Savassi"
 *             zipCode: "30112-000"
 *     responses:
 *       '200':
 *         description: 'Endereço atualizado com sucesso'
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
 *                   example: 'Endereço atualizado com sucesso'
 *                 data:
 *                   $ref: '#/components/schemas/Address'
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
 *       '404':
 *         description: 'Usuário não possui endereço para atualizar'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Endereço não encontrado"
 *               details: "Crie um endereço antes de tentar atualizá-lo"
 */
router.put('/', handleUpdateAddress);

/**
 * @swagger
 * /address:
 *   delete:
 *     summary: '🗑️ Deletar meu endereço de entrega'
 *     description: 'Remove permanentemente o endereço do usuário logado.'
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '204':
 *         description: 'Endereço deletado com sucesso'
 *       '401':
 *         description: 'Token inválido ou ausente'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: 'Usuário não possui endereço para deletar'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Endereço não encontrado"
 *               details: "Não há endereço cadastrado para deletar"
 *       '409':
 *         description: 'Endereço possui pedidos vinculados e não pode ser deletado'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Não é possível deletar o endereço'
 *                 details:
 *                   type: string
 *                   example: 'Existem pedidos vinculados a este endereço'
 */
router.delete('/', handleDeleteAddress);

export default router;