import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: [true, "please enter name !"],
            trim: true,
            index: true,
        },
        Email: {
            type: String,
            required: [true, "Please enter a email !"],
            unique: true,
            trim: true,
            index: true,
        },
        Password: {
            type: String,
            required: [true, "Please enter password !"],
            minLength: [3, "Password must be greater than 4 characters"],
            select: false,
        },
        resetPasswordToken: {
            type: Number,
            default: 5879859, // to avoid guess mathc
        },
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    // resisting pswd auto-change while updating userdata
    if (!this.isModified("Password")) {
        return next;
    }
    this.Password = await bcrypt.hash(this.Password, 10);
    next();
});

userSchema.methods.generateAccessToken = function () {
    //sign
    return Jwt.sign(
        { _id: this._id, Email: this.Email },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// pswd check
userSchema.methods.checkPassword = async function (givenPassword) {
    return (await bcrypt.compare(givenPassword, this.Password)).valueOf();
};

// Generating psswd reset token
userSchema.methods.getResetPswdToken = async function () {
    // generate random  number of reset token
    const resetToken = Math.floor(Math.random() * 100000 + 1);

    // hashing and adding resetpsswd token
    // this.resetPasswordToken = crypto
    //     .createHash("sha256")
    //     .update(resetToken)
    //     .digest("hex");
    // random Number
    this.resetPasswordToken = resetToken;

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // expires in 10 mins
    return resetToken;
};

export const User = mongoose.model("User", userSchema);
