import { Types, Document } from "mongoose";

export interface ItemInterface extends Document {
    itemName: string;
    title: string; 
    price: number;
    quantity: number;
    vendor: Types.ObjectId;
    description?: string;  
    image?: string; 
    rating?: number;
}