import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { acceptOrderController, allAssignedOrdersController, completeOrderController } from "../controllers/deliveryPartner.controler";

const router = Router();


router.get("/allassignedorders", authMiddleware, allAssignedOrdersController);
router.post("/acceptorder/:orderId", authMiddleware, acceptOrderController);
router.post("/completeorder/:orderId", authMiddleware, completeOrderController);

export default router;