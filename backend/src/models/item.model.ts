import mongoose from "mongoose";
import { ItemInterface } from "../interfaces/item.interface";


const itemSchema = new mongoose.Schema<ItemInterface>({
    itemName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
}, { timestamps: true });

const ItemModel = mongoose.model<ItemInterface>('Item', itemSchema);
export default ItemModel;