import { Request, Response } from "express";
import OrderModel from "../models/order.model";
import { UserPayloadInterface } from "../interfaces/userPayload.interface";
import UserModel from "../models/user.model";

export const getAllOrdersController = async (req:Request, res:Response): Promise<void> => {

    try {

        const orders = await OrderModel.find().sort({createdAt: -1}).populate("customer").populate("deliveryPartner").populate("vendor").populate("items").populate("items");

        if (!orders || orders.length === 0) {
            res.status(404).json({
                message: "No orders found",
                success: false
            });
            return;
        }

        res.status(200).json({
            message: "Orders fetched successfully",
            success: true,
            orders: orders.map(order => ({
                id: order._id,
                customer: order.customer,
                vendor: order.vendor,
                deliveryPartner: order.deliveryPartner,
                items: order.items,
                address: order.address,
                status: order.status,
                currentLocation: order.currentLocation,
                createdAt: order.createdAt
            }))
        });

        
    } catch (error) {
        console.error("Error in getAllOrdersController:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

}

export const createOrderController = async (req: Request, res: Response): Promise<void> => {

    try {

        const {id} = req.user as UserPayloadInterface;
        const { vendorId, itemId, address} = req.body;

        if (!id) {
            res.status(401).json({
                message: "Unauthorized access",
                success: false
            });
            return;
        }

        const vender = await UserModel.findById(vendorId);
        if (!vender) {
            res.status(404).json({
                message: "Vendor not found",
                success: false
            });
            return;
        }   

        const lat = vender.currentLocation?.latitude;
        const lng = vender.currentLocation?.longitude;

        if (!vendorId || !itemId || !address) {
            res.status(400).json({
                message: "Vendor ID and Item ID are required",
                success: false
            });
            return;
        }

        const order = new OrderModel({
            customer: id,
            vendor: vendorId,
            items: [itemId],
            address: address || "Default Address",
            status: "pending",
            currentLocation: [{
                lat: lat || 0.0,
                lng: lng || 0.0
            }]
        });

        const savedOrder = await order.save();

        if (!savedOrder) {
            res.status(500).json({
                message: "Error creating order",
                success: false
            });
            return;
        }
        res.status(201).json({
            message: "Order created successfully",
            success: true,
            order: {
                id: savedOrder._id,
                customer: savedOrder.customer,
                vendor: savedOrder.vendor,
                items: savedOrder.items,
                address: savedOrder.address,
                status: savedOrder.status,
                currentLocation: savedOrder.currentLocation,
                createdAt: savedOrder.createdAt
            }
        });

        
    } catch (error) {
        console.error("Error in createOrderController:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

}