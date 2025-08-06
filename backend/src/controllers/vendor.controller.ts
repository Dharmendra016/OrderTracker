import { Request, Response } from "express";
import OrderModel from "../models/order.model";
import UserModel from "../models/user.model";
import ItemModel from "../models/item.model";

export const assignOrderToDeliveryController = async (req: Request, res: Response):Promise<void> => {

    try{

        const { orderId } = req.params; 
        const { deliveryId, pickupAddress, deliveryAddress } = req.body;
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
        order.pickupAddress = pickupAddress;
        order.deliveryAddress = deliveryAddress;
        
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
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

}

export const createItemController = async ( req: Request, res: Response ): Promise<void> => {

    try {

        const { name, title, price, quantity, vendorId, description, image, rating } = req.body;

        if (!name || !title || !price || !quantity || !vendorId) {
            res.status(400).json({
                message: "Name, title, price, quantity and vendor are required",
                success: false
            });
            return;
        }

        const vendor = await UserModel.findById(vendorId);
        if (!vendor || vendor.role !== 'vendor') {
            res.status(404).json({
                message: "Vendor not found or not a valid vendor",
                success: false
            });
            return;
        }

        const newItem = new ItemModel({
            itemName: name,
            title,
            price,
            quantity,
            vendor: vendor._id,
            description,
            image,
            rating
        });

        const savedItem = await newItem.save();
        if (!savedItem) {
            res.status(500).json({
                message: "Error creating item",
                success: false
            });
            return;
        }

        res.status(201).json({
            message: "Item created successfully",
            success: true,
            item: savedItem
        });

    } catch (error) {
        console.error("Error in createItemController:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
        
    }

}
