import express from 'express';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes'
import itemRoutes from './item.routes'
import addressRoutes from './address.routes'
import orderRoutes from './order.routes'


const router = express.Router();

// Registrar todas as rotas
router.use('/users', userRoutes);
router.use('/categories',categoryRoutes);
router.use('/items',itemRoutes);
router.use('/address',addressRoutes);
router.use('/order',orderRoutes)

export default router;