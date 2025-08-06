import mongoose from "mongoose";
import { ItemInterface } from "../interfaces/item.interface";


const itemSchema = new mongoose.Schema<ItemInterface>({
    itemName: {
        type: String,
        required: true,
    },
    title: {
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
    image: {
        type: String,
        default: "https://via.placeholder.com/150",
    },
    rating:{
        type: Number,
        default: 0,
        required: true,
        min: 0,
        max: 5
    }
}, { timestamps: true });

const ItemModel = mongoose.model<ItemInterface>('Item', itemSchema);
export default ItemModel;