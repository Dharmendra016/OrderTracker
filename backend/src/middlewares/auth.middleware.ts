import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../config/jwt";
import { UserPayloadInterface } from "../interfaces/userPayload.interface";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        console.log("Token in middleware:", req.cookies.token);

        if (!token) {
            res.status(401).json({
                message: "Unauthorized access",
                success: false
            });
            return;
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            res.status(401).json({
                message: "Invalid token",
                success: false
            });
            return;
        }
        req.user = decoded as UserPayloadInterface;

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({
            message: "Invalid token",
            success: false
        });
    }

}