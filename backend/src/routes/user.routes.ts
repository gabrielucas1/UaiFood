import express from 'express';
// 📋 Importando controladores com nomes corretos
import { handleCreateUser, GetAllUsers, Login } from '../controllers/user.controller';
// 🔐 Importando middlewares de segurança
import { authenticateToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * DOCUMENTAÇÃO DAS ROTAS DE USUÁRIO
 * 
 * 🌍 ROTAS PÚBLICAS (não precisam de login):
 * POST /api/users        - Criar nova conta
 * POST /api/users/login  - Fazer login
 * 
 * 🔒 ROTAS PROTEGIDAS (precisam de login + permissão):
 * GET /api/users         - Listar usuários (apenas ADMIN)
 * GET /api/users/profile - Ver próprio perfil (CLIENT ou ADMIN)
 */

// 🌍 ROTAS PÚBLICAS (qualquer um pode acessar)

// Criar nova conta de usuário
router.post('/create', handleCreateUser);

// Fazer login
router.post('/login', Login);

// 🔒 ROTAS PROTEGIDAS (requerem autenticação)

// Listar todos os usuários - APENAS ADMIN
router.get(
  '/',
  authenticateToken,        // 1º: Verifica se tem token válido
  checkRole('ADMIN'),      // 2º: Verifica se é ADMIN
  GetAllUsers              // 3º: Executa a função
);

// Ver perfil próprio - CLIENT ou ADMIN
router.get(
  '/profile',
  authenticateToken,        // 1º: Verifica se tem token válido
  (req, res) => {          // 2º: Função simples para perfil
    const userToken = (req as any).user;
    res.json({
      success: true,
      message: 'Perfil encontrado',
      data: {
        id: userToken.id,
        type: userToken.type,
        phone: userToken.phone
      }
    });
  }
);

export default router;