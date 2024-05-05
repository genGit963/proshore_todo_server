import Router from "express";

// controllers
import {
    insertManyTodo,
    addTodo,
    updateTodo,
    deleteTodo,
    getYourAllTodos,
    directDoneUpdate,
    directUndoneUpdate
} from "../controller/todo.controller.js";

//middleware
import authenticateUser from "../middleware/auth.middleware.js";

import { Todo } from "../model/todo.model.js";

const todoRouter = Router();

todoRouter.route("/add").post(authenticateUser, addTodo);
todoRouter.route("/add_many").post(authenticateUser, insertManyTodo);
todoRouter.route("/update/:id").patch(authenticateUser, updateTodo);
todoRouter.route("/done/:id").patch(authenticateUser, directDoneUpdate);
todoRouter.route("/undone/:id").patch(authenticateUser, directUndoneUpdate);
todoRouter.route("/delete/:id").delete(authenticateUser, deleteTodo);
todoRouter.route("/all").get(authenticateUser, getYourAllTodos);

// checking
todoRouter.route("/").get(async (req, res) => {
    try {
        const alltodo = await Todo.find();

        res.status(200).json({
            success: true,
            db: alltodo,
            db_status: "working",
            router: "Working",
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: " todo router not working !",
        });
    }
});

export default todoRouter;
