import express from 'express';
import { 
  handleCreateAddress, 
  handleGetAddress, 
  handleUpdateAddress, 
  handleDeleteAddress 
} from '../controllers/address.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Todas as rotas precisam de login
router.use(authenticateToken);

router.post('/', handleCreateAddress);  // Criar endereço
router.get('/', handleGetAddress);      // Ver MEU endereço
router.put('/', handleUpdateAddress);   // Atualizar MEU endereço
router.delete('/', handleDeleteAddress);// Deletar MEU endereço

export default router;