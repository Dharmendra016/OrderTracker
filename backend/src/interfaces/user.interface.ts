import { Types } from "mongoose";
import { Document } from "mongoose";


export interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'delivery' | 'vendor';
    shopName?: string;
    available?: boolean;
    currentLocation?: {
        latitude: number;
        longitude: number;
    };
}
