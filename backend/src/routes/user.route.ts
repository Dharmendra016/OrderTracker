import express from "express";
import { userLoginController, userSignupController } from "../controllers/user.controller"

const router = express.Router();


router.post('/signup', userSignupController)
router.post('/login', userLoginController) 

export default router;