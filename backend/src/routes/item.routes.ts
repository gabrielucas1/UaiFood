import express from 'express';
import { 
  handleCreateItem, 
  handleGetAllItems, 
  handleUpdateItem, 
  handleDeleteItem 
} from '../controllers/item.controller';
import { authenticateToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

// 🌍 Rota Pública: Todos podem ver o cardápio
router.get('/', handleGetAllItems);

// 🔒 Rotas de Admin: Só Admin pode gerenciar o cardápio
router.post('/', authenticateToken, checkRole('ADMIN'), handleCreateItem);
router.put('/:id', authenticateToken, checkRole('ADMIN'), handleUpdateItem);
router.delete('/:id', authenticateToken, checkRole('ADMIN'), handleDeleteItem);

export default router;