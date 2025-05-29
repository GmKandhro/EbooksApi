import express from "express";
import { ErroHandler } from "./middlewares/globalErrorHandler";

const app = express();

app.use(express.json());
// app.use(express.urlencoded());

// routes
import { userRouter } from "./user/userRouter.route";
app.use("/api/users", userRouter);

// error handler middleware

app.use(ErroHandler);

export { app };
