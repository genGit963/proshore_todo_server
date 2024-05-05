import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

const authenticateUser = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const Token = authHeader && authHeader.split(" ")[1];

        // console.log("Token: ", Token);

        if (!Token) {
            throw new ApiError(401, "--> Token is null ");
        }

        // verify tokenized user
        const verifyUser = Jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
        if (!verifyUser) {
            throw new ApiError(401, "User is not authenticated !!");
        }

        req.user = await User.findById(verifyUser._id);
        // console.log(req.user);
        next();
    } catch (err) {
        next({
            statusCode: err.statusCode,
            message: err.message,
        });
    }
});

export default authenticateUser;
