import { Request, Response } from 'express';
import { IOrder } from './orders.interface';
import { OrderModel } from './orders.model';
import ExcelJS from 'exceljs';

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

  async exportOrdersToExcel(req: Request, res: Response) {
    try {
      // --- FILTROS ---
      const { status, from, to, posId } = req.query;
      const filter: any = {};

      if (status && status !== 'all') filter.status = status;
      if (posId) filter.posId = posId;
      if (from || to) {
        filter.createdAt = {};
        if (from) filter.createdAt.$gte = new Date(from as string);
        if (to) {
          const toDate = new Date(to as string);
          toDate.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = toDate;
        }
      }

      const orders = await OrderModel.find(filter).lean();

      if (!orders.length) {
        return res.status(404).json({ message: 'No hay pedidos que cumplan el filtro' });
      }

      // --- CREAR EXCEL ---
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Pedidos');

      // --- ENCABEZADOS ---
      worksheet.columns = [
        // Pedido
        { header: 'ID Pedido', key: 'idOrder', width: 15 },
        { header: 'Fecha Pedido', key: 'createdAt', width: 20 },
        { header: 'Fecha Entrega', key: 'deliveryDate', width: 20 },
        { header: 'Estado', key: 'status', width: 15 },
        { header: 'Entregado', key: 'delivered', width: 12 },
        { header: 'Cobrado', key: 'charged', width: 12 },
        { header: 'Punto de Venta', key: 'pos', width: 25 },
        { header: 'POS ID', key: 'posId', width: 15 },
        { header: 'Usuario', key: 'username', width: 20 },
        { header: 'Origen', key: 'origin', width: 15 },

        // Cliente
        { header: 'Nombre', key: 'nameBuyer', width: 20 },
        { header: 'Apellido', key: 'lastNameBuyer', width: 20 },
        { header: 'DNI', key: 'identityDocument', width: 15 },
        { header: 'Teléfono', key: 'telBuyer', width: 20 },
        { header: 'Dirección', key: 'address', width: 30 },
        { header: 'Localidad', key: 'locality', width: 20 },
        { header: 'Tipo Dirección', key: 'addressType', width: 20 },
        { header: 'Método de Pago', key: 'paymentMethod', width: 20 },

        // Observaciones
        { header: 'Observación', key: 'observation', width: 40 },

        // Producto
        { header: 'ID Producto', key: 'productId', width: 15 },
        { header: 'Descripción', key: 'description', width: 30 },
        { header: 'Marca', key: 'brand', width: 20 },
        { header: 'Categorías', key: 'categories', width: 25 },
        { header: 'Precio', key: 'price', width: 12 },
        { header: 'IVA', key: 'iva', width: 10 },
        { header: 'Cantidad', key: 'quantity', width: 12 },
        { header: 'Total Venta', key: 'totalProduct', width: 15 },
        { header: 'En stock', key: 'inStock', width: 12 },
        { header: 'Tags', key: 'tags', width: 25 },
        { header: 'Atributos', key: 'attributes', width: 40 },
      ];

      // --- LLENAR DATOS ---
      for (const order of orders) {
        for (const item of order.items) {
          worksheet.addRow({
            // Pedido
            idOrder: order.idOrder,
            createdAt: order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : '',
            deliveryDate: order.deliveryDate
              ? new Date(order.deliveryDate).toLocaleDateString()
              : '',
            status: order.status,
            delivered: order.delivered ? 'Sí' : 'No',
            charged: order.charged ? 'Sí' : 'No',
            pos: order.pos,
            posId: order.posId,
            username: order.username || '',
            origin: order.origin,

            // Cliente
            nameBuyer: order.nameBuyer,
            lastNameBuyer: order.lastNameBuyer,
            identityDocument: order.identityDocument || '',
            telBuyer: order.telBuyer || '',
            address: order.address,
            locality: order.locality,
            addressType: order.addressType || '',
            paymentMethod: order.paymentMethod,

            // Observación
            observation: order.observation || '',

            // Producto
            productId: item.id,
            description: item.description,
            brand: item.brand,
            categories: (item.idCategories || []).join(', '),
            price: item.price,
            iva: item.iva,
            quantity: item.quantity ?? 0,
            totalProduct: (item.quantity ?? 1) * item.price,
            inStock: item.inStock ? 'Sí' : 'No',
            tags: (item.tags || []).join(', '),
            attributes: item.attributes
              ? Object.entries(item.attributes)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join('; ')
              : '',
          });
        }
      }

      // --- FORMATO ENCABEZADOS ---
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.height = 20;

      // --- RESPUESTA (descarga) ---
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=pedidos.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error: any) {
      console.error('Error al exportar Excel:', error);
      res
        .status(500)
        .json({ message: 'Error al exportar Excel', error: error.message });
    }
  }
}