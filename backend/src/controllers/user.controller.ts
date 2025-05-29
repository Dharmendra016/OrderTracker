import express, { Request, Response } from "express";
import { UserInterface } from "../interfaces/user.interface";
import { UserPayloadInterface } from "../interfaces/userPayload.interface";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt"
import { generateToken } from "../config/jwt";

export const userSignupController = async (req: Request, res: Response): Promise<void>   => {

    try {

        const {name, email, password, role } = req.body;

        if( !name || !email || !password || !role){
            res.status(400).json({
                message:"All fields are required",
                success:false
            })
            return;
        };

        // Check if user already exists
        const existingUser = await UserModel.findOne({email});
        if (existingUser) {
            res.status(400).json({
                message: "User already exists",
                success: false
            });
            return;
        }

        // hash password
        const hashedPassword = await bcrypt.hashSync(password, 10);

        // create new user 
        const newUser: UserInterface = new UserModel({
            name, 
            email,
            password: hashedPassword,
            role
        })

        // save user to database
        const savedUser = await newUser.save();

        if( !savedUser ){
            res.status(500).json({
                message: "Error saving user",
                success: false
            });
            return;
        }   

        res.status(201).json({
            message: "User created successfully",
            success: true,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        });
        

    } catch (error) {
        console.error("Error in userSignupController:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

}

export const userLoginController = async (req:Request, res:Response): Promise<void> => {

    try{
        const { email, password } = req.body;

        if( !email || !password ){
            res.status(400).json({
                message: "Email and password are required",
                success: false
            });
            return;
        }

        // find user by email
        const user = await UserModel.findOne({ email });

        if( !user ){
            res.status(404).json({
                message: "User not found",
                success: false
            });
            return;
        }

        // check password
        const isPasswordValid = await bcrypt.compareSync(password, user.password);

        if( !isPasswordValid ){
            res.status(401).json({
                message: "Invalid credentials",
                success: false
            });
            return;
        }

        const userData:UserPayloadInterface  = {
            id: user._id as string,
            name: user.name,
            email: user.email,
            role: user.role
        }
        // generate JWT token 
        const token = generateToken(userData);

        res.cookie("token", token)
        
        res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }catch(error) {
        console.error("Error in userLoginController:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

}

