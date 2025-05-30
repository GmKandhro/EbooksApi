import express from "express";
import { createUser, loginUser } from "./userController";

const userRouter = express.Router();

userRouter.route("/register").post(createUser);
userRouter.post("/login", loginUser);
export { userRouter };
