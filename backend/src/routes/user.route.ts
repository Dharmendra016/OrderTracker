import express from "express";
import { userLoginController, userLogoutController, userSignupController } from "../controllers/user.controller"

const router = express.Router();


router.post('/signup', userSignupController)
router.post('/login', userLoginController) 
router.get('/logout', userLogoutController)

export default router;