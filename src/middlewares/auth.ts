import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "../user/userModel.model";
import { UserTypes } from "../user/userTypes";

export interface AuthRequest extends Request {
    user: UserTypes;
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: string =
            req.cookies.accesstoken ||
            (req.header("Authorization")?.split(" ")[1] as string);

        if (!token) {
            return next(
                createHttpError(401, "Authorization token is required.")
            );
        }

        const decoded = verify(token, config.jwtSecret as string);
        const user = await User.findById((decoded as UserTypes)._id);

        const _req = req as AuthRequest;
        _req.user = user as UserTypes;

        next();
    } catch (error) {
        const err = error as Error;
        return next(
            createHttpError(500, err.message || "user is not autheticated")
        );
    }
};

export { auth };
