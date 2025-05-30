import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { User } from "./userModel.model";
import { UserTypes } from "./userTypes";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            const error = createHttpError(400, "All fields are required");
            next(error);
        }

        const user: UserTypes = (await User.findOne({
            email: email,
        })) as UserTypes;

        if (user) {
            const error = createHttpError(
                400,
                "user already exists with this email"
            );
            next(error);
        }

        const createduser: UserTypes = await User.create({
            name,
            email,
            password,
        });

        if (!createduser) {
            const error = createHttpError(400, "user was not created");
            next(error);
        }

        // generate accesstoken

        res.status(200).json({
            _id: createduser._id,
            message: "user registered successfully",
        });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = createHttpError(400, "All fields are required");
            next(error);
        }

        const user: UserTypes = (await User.findOne({
            email: email,
        })) as UserTypes;

        console.log(user);
        if (!user) {
            const error = createHttpError(404, "user not found");
            next(error);
        }

        const checkPassword: boolean = await user.isPasswordCorrect(password);

        console.log(checkPassword);

        if (!checkPassword) {
            return next(createHttpError(400, "email or password incorrect"));
        }

        const accesstoken: string = sign(
            {
                id: user._id,
            },
            config.jwtSecret as string,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "user login succssfull",
            userToken: accesstoken,
        });
    } catch (error) {
        const err = error as Error;
        return next(
            createHttpError(
                500,
                err.message || "Something went Wrong while login"
            )
        );
    }
};
export { createUser, loginUser };
