import { Router } from "express";
import { createOrderController, getAllOrdersController } from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();


router.get("/allorders", authMiddleware, getAllOrdersController);
router.post('/createorder',authMiddleware, createOrderController); 


export default router;
