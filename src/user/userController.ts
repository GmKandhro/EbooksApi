import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { User } from "./userModel.model";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            const error = createHttpError(400, "All fields are required");
            next(error);
        }

        const user = await User.findOne({ email: email });

        if (user) {
            const error = createHttpError(
                400,
                "user already exists with this email"
            );
            next(error);
        }

        const createduser = await User.create({
            name,
            email,
            password,
        });

        if (!createduser) {
            const error = createHttpError(400, "user was not created");
            next(error);
        }

        res.status(200).json({
            _id: createduser._id,
            message: "user registered successfully",
        });
    } catch (error) {
        next(error);
    }
};

export { createUser };
