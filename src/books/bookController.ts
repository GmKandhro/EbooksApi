import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Book } from "./bookModel";
import { AuthRequest } from "../middlewares/auth";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, genre } = req.body;
        if (!title || !description || !genre) {
            return next(
                createHttpError(
                    400,
                    "Title, description and genre are required"
                )
            );
        }

        // const coverImageLocalFilePath = req.files.colverImage

        // console.log(req.files);
        const files = req?.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        if (!files) {
            return next(createHttpError(400, "both files are required"));
        }

        const localFilePathofpdf = files.file[0].path;
        const localFilePathofCoverImage = files.coverImage[0].path;

        const pdf = await uploadOnCloudinary(localFilePathofpdf);
        const coverImage = await uploadOnCloudinary(localFilePathofCoverImage);

        if (!pdf || !coverImage) {
            return next(createHttpError(400, "both files are required"));
        }
        const _req = req as AuthRequest;
        const newBook = await Book.create({
            title,
            description,
            genre,
            author: _req.user._id,
            coverImage: pdf.secure_url,
            file: coverImage.secure_url,
        });

        res.status(200).json({
            message: "Book is create successfull",
            book: newBook,
        });
    } catch (error) {
        const err = error as Error;
        next(
            createHttpError(
                500,
                err.message || "someThing went wrong while creating book"
            )
        );
    }
};

export { createBook };
