import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { acceptOrderController, allAssignedOrdersController, changeAvailabilityController, completeOrderController } from "../controllers/deliveryPartner.controller";

const router = Router();


router.get("/allassignedorders", authMiddleware, allAssignedOrdersController);
router.post("/acceptorder/:orderId", authMiddleware, acceptOrderController);
router.post("/completeorder/:orderId", authMiddleware, completeOrderController);
router.post("/updateavailability", authMiddleware, changeAvailabilityController);

export default router;