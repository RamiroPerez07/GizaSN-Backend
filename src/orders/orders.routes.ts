import { Router } from 'express';
import authMiddleware from '../auth/auth.middleware';
import { OrdersController } from './orders.controller';

const router = Router();
const ordersController = new OrdersController();

router.post('/', authMiddleware, ordersController.createOrder); //crear un pedido
router.get('/:id', authMiddleware, ordersController.getOrderById);  //obtener pedido por id
router.get('/', authMiddleware, ordersController.getAllOrders); // Ruta para obtener todos los pedidos
router.delete('/:status', authMiddleware, ordersController.getOrdersByStatus); //Obtener pedidos por status
router.put('/:id', authMiddleware, ordersController.cancelOrder);

export default router;