import { Request, Response } from "express";
import OrderModel from "../models/order.model";

export const assignOrderToDeliveryController = async (req: Request, res: Response) => {

    try{

        const { orderId } = req.params; 
        const { deliveryId } = req.body;
        if( !orderId || !deliveryId ){
            res.status(400).json({
                message: "Order ID and Delivery ID are required",
                success: false
            });
            return;
        }

        // Find the order by ID
        const order = await OrderModel.findById(orderId);

        if( !order ){
            res.status(404).json({
                message: "Order not found",
                success: false
            });
            return;
        }

        // Check if the order is already assigned to a delivery person
        if( order.status === "assigned" ){
            res.status(400).json({
                message: "Order is already assigned to a delivery person",
                success: false
            });
            return;
        }
        // Update the order with the delivery person ID
        order.deliveryPartner = deliveryId;
        order.status = "assigned";
        const updatedOrder = await order.save();
        if( !updatedOrder ){
            res.status(500).json({
                message: "Error updating order",
                success: false
            });
            return;
        }
        res.status(200).json({
            message: "Order assigned to delivery person successfully",
            success: true,
            order: {
                id: updatedOrder._id,
                status: updatedOrder.status,
                deliveryPartner: updatedOrder.deliveryPartner
            }
        });

        
    }catch(error){
        console.error("Error in userLoginController:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

}
