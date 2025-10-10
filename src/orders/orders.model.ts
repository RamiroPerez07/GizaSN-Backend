import { Schema, model, Document } from 'mongoose';
import { IOrder } from './orders.interface';
import { IProduct } from '../products/products.interface';

// Extiende Document para que tenga los métodos de Mongoose
export interface OrderDocument extends IOrder, Document {}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: Number, required: true },
    description: { type: String, required: true },
    longDescription: String,
    brand: String,
    idCategories: [String],
    priority: Number,
    visible: Boolean,
    price: Number,
    iva: Number,
    discount: { type: Number, default: null },
    urlImg: String,
    inStock: Boolean,
    quantity: Number,
    tags: [String],
    showInHeroCarousel: Boolean,
    attributes: {
      content: String,
      packaging: String,
      services: String,
      flavor: String,
      colour: String,
      performance: String,
      textColor: String,
    },
    relatedProductsIds: [Number],
    cashDiscount: Number,
  },
  { timestamps: true } // esto crea automáticamente createdAt y updatedAt
  //{ _id: false } // evita crear un _id para cada producto dentro del pedido
);

const OrderSchema = new Schema<OrderDocument>(
  {
    idOrder: { type: String, required: true, unique: true },
    posId: { type: String, required: true },
    pos: { type: String, required: true },
    status: { type: String, required: true },
    origin: {type: String, required: true},
    delivered: { type: Boolean, default: false },
    charged: { type: Boolean, default: false },
    deliveryDate: { type: Date },
    nameBuyer: { type: String, required: true },
    lastNameBuyer: { type: String, required: true },
    identityDocument: String,
    telBuyer: String,
    paymentMethod: { type: String, required: true },
    address: { type: String, required: true },
    locality: { type: String, required: true },
    items: { type: [ProductSchema], required: true },
    observation: {type: String},
  },
  { timestamps: true } // esto crea automáticamente createdAt y updatedAt
);

export const OrderModel = model<OrderDocument>('Order', OrderSchema);