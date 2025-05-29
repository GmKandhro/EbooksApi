import express from "express";
import { ErroHandler } from "./middlewares/globalErrorHandler";

const app = express();

// routes
app.get("/getData", (req, res) => {
    res.json({ message: "WElcome Gmkandhro" });
});

// error handler middleware

app.use(ErroHandler);

export { app };
