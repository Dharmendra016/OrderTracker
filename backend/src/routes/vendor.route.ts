import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { assignOrderToDeliveryController, createItemController } from "../controllers/vendor.controller";

const router = Router();


router.post("/assignorder/:orderId", authMiddleware, assignOrderToDeliveryController);
router.post("/createitem", authMiddleware, createItemController);
export default router;
