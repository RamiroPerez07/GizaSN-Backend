import { IProduct } from "../products/products.interface";


export interface IOrder{
    idOrder: string;
    posId: string;
    pos: string;
    status: string;
    delivered: boolean;
    charged: boolean;
    deliveryDate?: Date | null;
    nameBuyer: string;
    lastNameBuyer: string;
    identityDocument?: string;
    telBuyer?: string;
    paymentMethod: string;
    addressType?: string;
    address: string;
    locality: string;
    origin: string;
    items: IProduct[];
    observation?: string;
    updatedAt?: Date;
    createdAt?: Date;
    username?: string;
}