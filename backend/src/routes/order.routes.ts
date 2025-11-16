import express from 'express';
import { handleCreateOrder, handleGetAllOrders } from '../controllers/order.controller';
import { authenticateToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

// --- Rotas de Pedido ---

// 🔒 Criar Pedido: Deve ser protegido para CLIENT ou ADMIN
router.post(
  '/',
  authenticateToken, 
  handleCreateOrder
);

// 🔒 Listar Pedidos: Protegido. O service filtra quem pode ver o quê.
router.get(
  '/', 
  authenticateToken, 
  handleGetAllOrders
);

export default router;