import { Todo } from "../model/todo.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// insert many todo
const insertManyTodo = asyncHandler(async (req, res) => {
    try {
        // console.log("Req.body: ", req.body[0], req.body[3], req.body[5]);

        const todos = req.body.map((todo) => ({
            Name: todo.Name,
            Short_Description: todo.Short_Description,
            Deadline: todo.Deadline,
            Status: todo.Status,
            User: req.user.id,
        }));

        // console.log("\n\n\nTodos: ", todos[0], todos[3], todos[5]);
        await Todo.insertMany(todos);
        res.status(200).json({
            success: true,
            message: "All todos are added successfully !",
        });
    } catch (error) {
        res.status(400).json({
            message: `insertMany failed due to: ${error}`,
        });
    }
});

// add
const addTodo = asyncHandler(async (req, res, next) => {
    try {
        const { Name, Short_Description, Status, Deadline } = req.body;
        // console.log(req.body);

        if (
            [Name, Short_Description, Status, Deadline].some(
                (field) => field === ""
            )
        ) {
            throw new ApiError(400, "All fields are required !");
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
            todos: allTodos,
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
        const { Name, Short_Description, Status, Deadline } = req.body;
        console.log(req.body);
        const { id } = req.params;

        const todo = await Todo.findByIdAndUpdate(
            id,
            {
                Name,
                Short_Description,
                Deadline,
                Status,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Updated Successfully",
            data: todo,
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
        // console.log(req.params.id, req.user);
        const { id } = req.params;
        const todo = await Todo.findByIdAndDelete(id);

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

// direct done update
const directDoneUpdate = asyncHandler(async (req, res) => {
    try {
        // console.log(req.params.id, req.user);
        const { id } = req.params;
        const Status = "done";
        const todo = await Todo.findByIdAndUpdate(
            id,
            {
                Status,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Updated Successfully",
            data: todo,
        });
    } catch (error) {
        res.status(400).json({
            status: error.statusCode,
            message: error.message,
        });
    }
});

// direct done update
const directUndoneUpdate = asyncHandler(async (req, res) => {
    try {
        // console.log(req.params.id, req.user);
        const { id } = req.params;
        const Status = "upcoming";
        const todo = await Todo.findByIdAndUpdate(
            id,
            {
                Status,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Updated Successfully",
            data: todo,
        });
    } catch (error) {
        res.status(400).json({
            status: error.statusCode,
            message: error.message,
        });
    }
});

export {
    insertManyTodo,
    addTodo,
    updateTodo,
    deleteTodo,
    getYourAllTodos,
    directDoneUpdate,
    directUndoneUpdate
};
