import { Request, Response } from 'express';
import { IOrder } from './orders.interface';
import { OrderModel } from './orders.model';

export class OrdersController {
  
  // Crear un pedido
  async createOrder(req: Request, res: Response) {
    try {
      const orderData: IOrder = req.body;
      const newOrder = new OrderModel(orderData);
      const savedOrder = await newOrder.save();
      return res.status(201).json(savedOrder);
    } catch (error: any) {
      console.error('Error al crear pedido:', error);
      return res.status(500).json({ message: 'Error al crear pedido', error: error.message });
    }
  }

  // Obtener pedidos por status (o todos)
  async getOrdersByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const filter = status === 'all' ? {} : { status };

      const [orders, total] = await Promise.all([
        OrderModel.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        OrderModel.countDocuments(filter),
      ]);

      return res.status(200).json({
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
        orders,
      });
    } catch (error: any) {
      console.error('Error al obtener pedidos por status:', error);
      return res.status(500).json({ message: 'Error al obtener pedidos por status', error: error.message });
    }
  }

  // Editar el status de un pedido a "Anulado"
  async cancelOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const updatedOrder = await OrderModel.findByIdAndUpdate(
        id,
        { status: 'Anulado' },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      return res.status(200).json(updatedOrder);
    } catch (error: any) {
      console.error('Error al anular pedido:', error);
      return res.status(500).json({ message: 'Error al anular pedido', error: error.message });
    }
  }

  // Obtener un pedido por ID
  async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await OrderModel.findById(id);

      if (!order) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      return res.status(200).json(order);
    } catch (error: any) {
      console.error('Error al obtener pedido por ID:', error);
      return res.status(500).json({ message: 'Error al obtener pedido', error: error.message });
    }
  }

  async updateOrderStatus (req: Request, res: Response) {
    const { id } = req.params;
    const updates = req.body; // puede contener delivered, charged, status

    try {
      // Opcional: validar que solo se puedan actualizar ciertos campos
      // const allowedFields = ['delivered', 'charged', 'status', 'observation', 'deliveryDate'];
      // const payload: any = {};
      // for (const key of allowedFields) {
      //   if (key in updates) payload[key] = updates[key];
      // }

      const updatedOrder = await OrderModel.findByIdAndUpdate(
        id,
        //payload,
        updates,
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      res.json(updatedOrder);
    } catch (err: any) {
      console.error('Error actualizando pedido:', err);
      res.status(500).json({ error: err.message });
    }
  }
}