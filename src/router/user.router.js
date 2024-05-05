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
import { User } from "../model/user.model.js";

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


// ---------------------------------------- uncoment to test -------------------------------
// id resolover: (---> for system adim only)
// userRouter.route("/:user_id").get(async (req, res) => {
//     try {
//         const id = req.params.user_id;
//         // console.log(id);
//         const user = await User.findById(id);

//         res.status(200).json({
//             success: true,
//             data: user,
//         });
//     } catch (error) {
//         res.status(401).json({
//             status: 401,
//             message: "User not found !",
//         });
//     }
// });

export default userRouter;
