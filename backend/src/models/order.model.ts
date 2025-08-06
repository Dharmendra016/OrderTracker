import mongoose from "mongoose";
import { OrderInterface } from "../interfaces/order.interface";
import { v4 as uuid } from 'uuid';


const orderSchema = new mongoose.Schema<OrderInterface>({
    customer: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'User',
        required: true,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    }],
    deliveryAddress: {
        type: String,
    },
    pickupAddress: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'on_the_way', 'delivered'],
        default: 'pending',
    },
    roomNumber: {
        type: String,
        required: true,
        default: uuid(), 
    },
    currentLocation: [{
        lat: {
            type: Number,
            default: 0.0,
        },
        lng: {
            type: Number,
            default: 0.0,
        },
    }],
}, { timestamps: true });

const OrderModel = mongoose.model<OrderInterface>('Order', orderSchema);
export default OrderModel;