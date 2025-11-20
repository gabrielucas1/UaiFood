import express from 'express';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import itemRoutes from './item.routes';
import orderRoutes from './order.routes';
import addressRoutes from './address.routes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/items', itemRoutes);
router.use('/orders', orderRoutes);
router.use('/address', addressRoutes);

export default router;