import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { assignOrderToDeliveryController } from "../controllers/vendor.controller";

const router = Router();


router.post("/assignorder/:orderId", authMiddleware, assignOrderToDeliveryController);

export default router;
