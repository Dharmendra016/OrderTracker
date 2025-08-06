import { Request, Response } from "express";
import OrderModel from "../models/order.model";
import { UserPayloadInterface } from "../interfaces/userPayload.interface";
import UserModel from "../models/user.model";
import {v4 as uuid} from 'uuid';

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
                pickupAddress: order.pickupAddress,
                deliveryAddress: order.deliveryAddress,
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

        const roomNumber = uuid(); 

        const order = new OrderModel({
            customer: id,
            vendor: vendorId,
            items: [itemId],
            address: address || "Default Address",
            status: "pending",
            roomNumber: roomNumber,
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
                pickupAddress: savedOrder.pickupAddress,
                deliveryAddress: savedOrder.deliveryAddress,
                status: savedOrder.status,
                roomNumber: savedOrder.roomNumber,
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


export const updateStatusController = async (req: Request, res: Response): Promise<void> => {
    try {

        const {id} = req.user as UserPayloadInterface;
        const { orderId, status } = req.body;

        if (!id) {
            res.status(401).json({
                message: "Unauthorized access",
                success: false
            });
            return;
        }

        if (!orderId || !status) {
            res.status(400).json({
                message: "Order ID and status are required",
                success: false
            });
            return;
        }

        const order = await OrderModel.findById(orderId);

        if (!order) {
            res.status(404).json({
                message: "Order not found",
                success: false
            });
            return;
        }

        order.status = status;

        const updatedOrder = await order.save();

        if (!updatedOrder) {
            res.status(500).json({
                message: "Error updating order status",
                success: false
            });
            return;
        }

        res.status(200).json({
            message: "Order status updated successfully",
            success: true,
            order: {
                id: updatedOrder._id,
                vendor: updatedOrder.vendor,
                items: updatedOrder.items,
                status: updatedOrder.status,
                deliveryPartner: updatedOrder.deliveryPartner,
                pickupAddress: updatedOrder.pickupAddress,
                deliveryAddress: updatedOrder.deliveryAddress,
            }
        });

        
    } catch (error) {
        console.error("Error in updateStatusController:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

}