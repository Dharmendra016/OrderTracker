import { Request, Response } from "express";
import { getDistance, getLocationCoordinates } from "../services/map.services";

export const getAddressCoordinate = async (req: Request, res: Response): Promise<void> => {

    try {

        const { address } = req.query;
        if (!address || typeof address !== 'string') {
            res.status(400).json({
                message: "Address is required and must be a string",
                success: false
            });
            return;
        }
        
        const coordinates = await getLocationCoordinates(address);
        if (!coordinates) {
            res.status(404).json({
                message: "Coordinates not found for the provided address",
                success: false
            });
            return;
        }
        res.status(200).json({
            message: "Coordinates fetched successfully",
            success: true,
            coordinates: {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            }
        });



    } catch (error) {
        console.error("Error in getAddressCoordinate:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });

    }

}


export const getDistanceBetweenCoordinates = async (req: Request, res: Response): Promise<void> => {

    try {
    
        const {origin, destination} = req.body;
        if (!origin || !destination) {
            res.status(400).json({
                message: "Origin and destination coordinates are required",
                success: false
            });
            return;
        }

        const originCoordinates = await getLocationCoordinates(origin);
        const destinationCoordinates = await getLocationCoordinates(destination);


        if (!originCoordinates || !destinationCoordinates) {
            res.status(404).json({
                message: "Coordinates not found for the provided addresses",
                success: false
            });
            return;
        }

        const distance = getDistance(originCoordinates, destinationCoordinates);
        if (distance === null) {
            res.status(500).json({
                message: "Error calculating distance",
                success: false
            });
            return;
        }
        res.status(200).json({
            message: "Distance calculated successfully",
            success: true,
            distance: distance
        });

    }catch(error) {
        console.error("Error in getDistanceBetweenCoordinates:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

}