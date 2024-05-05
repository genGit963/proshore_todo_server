import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../model/user.model.js";
import ApiError from "../utils/apiError.js";
import sendTokenResponse from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";

//registration
const signup = asyncHandler(async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;
        // console.log(req.body);
        const validateData = [Name, Email, Password].some(
            (field) => field === ""
        );
        if (validateData) throw new ApiError(400, "Required All field !!");

        // checking if email is used already
        const existedUser = await User.findOne({ Email: Email });

        if (existedUser) {
            throw new ApiError(409, "Already register Email: " + `${Email}`);
        }

        const newUser = await User.create({
            Name,
            Email,
            Password,
        });

        // ensuring registration successfully
        const createdUser = await User.findById(newUser._id);
        if (!createdUser) {
            throw new ApiError(500, "Registration Fail !!");
        }
        sendTokenResponse(201, newUser, res, "Registration Successful !!");
    } catch (err) {
        res.status(400).json({
            statusCode: err.statusCode,
            Error: err.message,
        });
    }
});

// login
const login = asyncHandler(async (req, res) => {
    try {
        const { Email, Password } = req.body;
        // console.log(req.body);
        if (!Email || !Password) {
            throw new ApiError(400, "Please Enter Email or Password !!");
        }
        const checkingUser = await User.findOne({ Email: Email }).select(
            "+Password"
        );

        if (!checkingUser) {
            throw new ApiError(404, "User doesn't Exist !! -> ");
        }

        // checking password
        const isPasswordMatched = await checkingUser.checkPassword(Password);
        if (isPasswordMatched) {
            sendTokenResponse(200, checkingUser, res, "Login Successfully");
        } else {
            throw new ApiError(401, "Paswrod Invalid !!");
        }
    } catch (err) {
        res.status(404).json({
            statusCode: err.statusCode,
            Error: err.message,
        });
    }
});

//  forgetPassword
const forgotPassword = asyncHandler(async (req, res) => {
    try {
        const { Email } = req.body;
        const validUser = await User.findOne({ Email: Email });

        if (!validUser) {
            throw new ApiError(404, "No email or Phone Number is found !!");
        }

        // Reset password Token
        const resetToken = await validUser.getResetPswdToken();

        await validUser.save({ validateBeforeSave: false });

        const resetPswdURL = String(
            `${req.protocol}://${req.get(
                "host"
            )}/user/password/reset/${resetToken}`
        );

        const message = `ALERT !!: if you didn't request reset password, delete this mail. Your Reset Token is ${resetToken}.`;

        await sendEmail({
            email: validUser.Email,
            subject: "Proshore Todo: Password Recovery Portal",
            mailContent: message,
        });

        res.status(200).json({
            success: true,
            message: `Passowrd Recovery OTP is sent to ${validUser.Email}, check out.( For testing emails, I have given here: ${resetToken}), this will expire in 10 mins. [Note: try valid email to see if this forget passwor methods works or not. FIRST sign up with that email.]`,
        });
    } catch (err) {
        res.status(404).json({
            statusCode: err.statusCode,
            message: err.message,
        });
    }
});

// password Recovery
const passwordRecovery = asyncHandler(async (req, res, next) => {
    try {
        const { OTP, newPassword } = req.body;
        // console.log(OTP, newPassword);

        const checkOTPUser = await User.findOne({ resetPasswordToken: OTP });
        if (!checkOTPUser) {
            throw new ApiError(401, "OTP mismatched !!");
        }
        checkOTPUser.Password = newPassword;
        checkOTPUser.resetPasswordToken = 4859224; // random reseting after pswd changed
        await checkOTPUser.save();

        res.status(200).json({
            success: true,
            message: "Password Changed Successfully. !!, Try Login",
        });
    } catch (err) {}
});

// logout
const logout = asyncHandler(async (req, res) => {
    try {
        res.cookie("Token ", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        const user = req.user; // logged out user detail

        res.status(200).json({
            status: 200,
            logout: "completed",
            message: `${user.Name}` + " is logged out Successfull !!",
        });
    } catch (err) {
        res.status(400).json(new ApiError(400, err));
    }
});

//  getUserDetails
const getUserDetails = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findOne(req.user._id);
        if (!user) {
            throw new ApiError(404, "Users' detail is not found !!");
        }
        res.status(200).json({
            Name: user.Name,
            Email: user.Email,
            Since: user.createdAt,
        });
    } catch (err) {
        res.status(404).json({
            statusCode: err.statusCode,
            message: err.message,
        });
    }
});

export {
    signup,
    login,
    logout,
    forgotPassword,
    passwordRecovery,
    getUserDetails,
};
