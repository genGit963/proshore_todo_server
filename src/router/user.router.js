import { Router } from "express";

// controller
import {
    signup,
    login,
    logout,
    forgotPassword,
    passwordRecovery,
    getUserDetails,
    
} from "../controller/user.controller.js";

// middleware
import authenticateUser from "../middleware/auth.middleware.js";

// user-router
const userRouter = Router();

// routes

// without token routes
userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);
userRouter.route("/forget_password").post(forgotPassword);
userRouter.route("/new_password").post(passwordRecovery);

// required token access routes
userRouter.route("/logout").get(authenticateUser, logout);
userRouter.route("/me").get(authenticateUser, getUserDetails);


export default userRouter;
