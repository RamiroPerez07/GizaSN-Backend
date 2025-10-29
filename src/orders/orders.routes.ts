import { Router } from 'express';
import authMiddleware from '../auth/auth.middleware';
import { OrdersController } from './orders.controller';

const router = Router();
const ordersController = new OrdersController();

router.post('/', ordersController.createOrder); //crear un pedido
router.patch('/:id', ordersController.updateOrderStatus);
router.get('/status/:status', ordersController.getOrdersByStatus); //Obtener pedidos por status
router.get('/:id', ordersController.getOrderById);  //obtener pedido por id
router.put('/:id', ordersController.cancelOrder); // Anular orden
router.get('/export/excel', ordersController.exportOrdersToExcel);

export default router;