// dependencies
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// server-app
const app = express();

// cors
app.use(cors());

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Routers
import userRouter from "./router/user.router.js";
import todoRouter from "./router/todo.router.js";

app.use("/api/user", userRouter);
app.use("/api/todo", todoRouter);

app.get("/", (req, res) => {
    res.json({ message: `http://localhost:${process.env.PORT}` });
});

export default app;
