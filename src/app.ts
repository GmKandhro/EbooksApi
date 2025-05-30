import express from "express";
import { ErroHandler } from "./middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());

// routes
import { userRouter } from "./user/userRouter";
import { bookRouter } from "./books/bookRoute";
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// error handler middleware

app.use(ErroHandler);

export { app };
