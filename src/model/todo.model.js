import mongoose from "mongoose";

const todoSchema = mongoose.Schema(
    {
        Name: {
            type: String,
            required: [true, "please enter name !"],
            trim: true,
            index: true,
        },
        Short_Description: {
            type: String,
            required: [true, "please enter name !"],
            trim: true,
            index: true,
        },
        Status: {
            type: String,
            default: "upcoming",
        },
        User: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },

    { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
