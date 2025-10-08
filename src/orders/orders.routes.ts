import { Router } from 'express';
import authMiddleware from '../auth/auth.middleware';
import { OrdersController } from './orders.controller';

const router = Router();
const ordersController = new OrdersController();

router.post('/', ordersController.createOrder); //crear un pedido
router.get('/status/:status', ordersController.getOrdersByStatus); //Obtener pedidos por status
router.get('/:id', ordersController.getOrderById);  //obtener pedido por id
router.get('/', ordersController.getAllOrders); // Ruta para obtener todos los pedidos
router.put('/:id', ordersController.cancelOrder);

export default router;