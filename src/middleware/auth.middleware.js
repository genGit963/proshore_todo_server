import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

const authenticateUser = asyncHandler(async (req, res, next) => {
    try {
        // const { Token } = req.cookies;
        const Token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM0NGEzMmNkNWZiMjYyNmY5Njk4YjUiLCJFbWFpbCI6InRlc3RlckBwcm9zaG9yZS5jb20iLCJpYXQiOjE3MTQ3MDMxNjYsImV4cCI6MTcxNDc4OTU2Nn0.S9wA2pXG71QtOAF5pbh3QBHry3SdqKZFdtfeGxeu1OU";

        console.log("Token: ", Token);

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
