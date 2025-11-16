import express from 'express';
import { 
  handleCreateCategory, 
  handleGetAllCategories,
  handleUpdateCategory,
  handleDeleteCategory
} from '../controllers/category.controller';
// Reutilizando seus middlewares de autenticação
import { authenticateToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

// rota global, que todos tem acesso
router.get('/', handleGetAllCategories)

// rota de criar uma category, onde somente o admin tem acesso
router.post('/', authenticateToken,checkRole('ADMIN'),handleCreateCategory);

// rota para atualizar uma categoria
router.put('/:id',authenticateToken,checkRole('ADMIN'),handleUpdateCategory)

//rota para deletar categoria
router.delete('/:id',authenticateToken,checkRole('ADMIN'),handleDeleteCategory);

export default router;
