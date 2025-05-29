import mongoose from "mongoose";
import { UserInterface } from "../interfaces/user.interface";

const userSchema = new mongoose.Schema<UserInterface>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['customer', 'delivery', 'vendor'],
        required: true,
    },
    shopName: {
        type: String,
        default: '',
    },
    available: {
        type: Boolean,
        default: true,
    },
    currentLocation: {
        latitude: {
            type: Number,
            default: 0.0,
        },
        longitude: {
            type: Number,
            default: 0.0,
        },
    },
}, { timestamps: true });

const UserModel = mongoose.model<UserInterface>('User', userSchema);

export default UserModel;
