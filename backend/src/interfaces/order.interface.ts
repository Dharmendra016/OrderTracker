import { Document, Types } from "mongoose";
export interface OrderInterface extends Document {
    customer: Types.ObjectId;
    vendor: Types.ObjectId;
    deliveryPartner?: Types.ObjectId;
    items: Types.ObjectId[];
    status: 'pending' | 'assigned' | 'on_the_way' | 'delivered';
    address: string;
    roomNumber: string;
    currentLocation?: {
        lat: number;
        lng: number;
    }[];
    createdAt: Date;
}