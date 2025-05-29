import { Request, Response } from "express";
import OrderModel from "../models/order.model";
import mongoose from "mongoose";


export const allAssignedOrdersController = async (req: Request, res: Response): Promise<void> => {

    try {

        const { id } = req.user as { id: string };
        if (!id) {
            res.status(401).json({
                message: "Unauthorized access",
                success: false
            });
            return;
        }

        const assignedOrders = await OrderModel.find({
            deliveryPartner: id,
            status: "assigned"
        }
        ).populate("customer").populate("vendor").populate("items");

        if (!assignedOrders || assignedOrders.length === 0) {
            res.status(404).json({
                message: "No assigned orders found",
                success: false
            });
            return;
        }

        res.status(200).json({
            message: "Assigned orders fetched successfully",
            success: true,
            orders: assignedOrders.map(order => ({
                id: order._id,
                customer: order.customer,
                vendor: order.vendor,
                items: order.items,
                address: order.address,
                status: order.status,
                currentLocation: order.currentLocation,
                createdAt: order.createdAt
            }))
        });

    } catch (error) {
        console.error("Error in allAssignedOrdersController:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

}


export const acceptOrderController = async (req: Request, res: Response): Promise<void> => {

    try {
        const { id } = req.user as { id: string };
        const { orderId } = req.params;

        if (!id || !orderId) {
            res.status(400).json({
                message: "User ID and Order ID are required",
                success: false
            });
            return;
        }

        // Find the order by ID
        const order = await OrderModel.findById(orderId);

        if (!order) {
            res.status(404).json({
                message: "Order not found",
                success: false
            });
            return;
        }

        // Check if the order is already assigned to a delivery person
        if (order.status === "assigned") {
            res.status(400).json({
                message: "Order is already assigned to a delivery person",
                success: false
            });
            return;
        }

        // Update the order with the delivery partner ID and status
        order.deliveryPartner = new mongoose.Types.ObjectId(id);
        order.status = "assigned";
        const updatedOrder = await order.save();

        if (!updatedOrder) {
            res.status(500).json({
                message: "Error updating order",
                success: false
            });
            return;
        }

        res.status(200).json({
            message: "Order accepted successfully",
            success: true,
            order: {
                id: updatedOrder._id,
                status: updatedOrder.status,
                deliveryPartner: updatedOrder.deliveryPartner
            }
        });

    } catch (error) {
        console.error("Error in acceptOrderController:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

}

export const completeOrderController = async (req: Request, res: Response): Promise<void> => {

    try {

        const { id } = req.user as { id: string }
        const { orderId } = req.params;
        if (!id || !orderId) {
            res.status(400).json({
                message: "User ID and Order ID are required",
                success: false
            });
            return;
        }

        // Find the order by ID
        const order = await OrderModel.findById(orderId);
        if (!order) {
            res.status(404).json({
                message: "Order not found",
                success: false
            });
            return;
        }

        // Check if the order is assigned to the delivery partner
        if (order?.deliveryPartner?.toString() !== id) {
            res.status(403).json({
                message: "You are not authorized to complete this order",
                success: false
            });
            return;
        }
        // Update the order status to 'delivered'
        order.status = "delivered";
        const updatedOrder = await order.save();
        if (!updatedOrder) {
            res.status(500).json({
                message: "Error updating order",
                success: false
            });
            return;
        }
        res.status(200).json({
            message: "Order completed successfully",
            success: true,
            order: {
                id: updatedOrder._id,
                status: updatedOrder.status,
                deliveryPartner: updatedOrder.deliveryPartner
            }
        });


    } catch (error) {
        console.error("Error in completeOrderController:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};