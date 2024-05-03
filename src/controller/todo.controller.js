import { Todo } from "../model/todo.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// add
const addTodo = asyncHandler(async (req, res, next) => {
    try {
        const { Name, Short_Description } = req.body;
        // console.log(req.body, req.user);

        if ([Name, Short_Description].some((field) => field === "")) {
            throw new ApiError(
                400,
                "Name and Short_Description are required !"
            );
        }
        // setting user
        req.body.User = req.user.id;
        const newTodo = await Todo.create(req.body);
        if (!newTodo) {
            throw new ApiError(400, "Todo add to database failed ! Try Again");
        }
        res.status(200).json({
            success: true,
            message: "Todo is added successfully !",
            data: newTodo,
        });
    } catch (error) {
        res.status(400).json({
            statusCode: error.statusCode,
            message: error.message,
        });
    }
});

// get all your todo
const getYourAllTodos = asyncHandler(async (req, res) => {
    try {
        // console.log(req.user);
        if (!req.user) {
            throw new ApiError(401, "User unauthorized !");
        }
        const allTodos = await Todo.find({ User: req.user.id });
        res.status(200).json({
            success: true,
            message: "All your Todos !",
            data: allTodos,
        });
    } catch (error) {
        res.status(404).json({
            status: error.statusCode,
            message: error.message,
        });
    }
});

// update
const updateTodo = asyncHandler(async (req, res) => {
    try {
        // console.log(req.params.id, req.user);
        const { Name, Short_Description, Status } = req.body;

        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    Name: Name,
                    Short_Description: Short_Description,
                    Status: Status,
                },
            }
        );

        // await todo.save();

        if (!todo) {
            throw new ApiError(404, "Todo not found !");
        }
        res.status(200).json({
            success: true,
            message: "Updated Successfully",
            data: await Todo.find({ _id: req.params.id }),
        });
    } catch (error) {
        res.status(400).json({
            status: error.statusCode,
            message: error.message,
        });
    }
});

// delete
const deleteTodo = asyncHandler(async (req, res) => {
    try {
        console.log(req.params.id, req.user);

        const todo = await Todo.findOneAndDelete({ _id: req.params.id });

        if (!todo) {
            throw new ApiError(404, "Todo not found ! ");
        }
        res.status(200).json({
            success: true,
            message: "Deleted Successfully",
            data: todo,
        });
    } catch (error) {
        res.status(400).json({
            status: error.statusCode,
            message: error.message,
        });
    }
});

export { addTodo, updateTodo, deleteTodo, getYourAllTodos };
