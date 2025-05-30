import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import { Book } from "./bookModel";
import { AuthRequest } from "../middlewares/auth";
import { isValidObjectId } from "mongoose";

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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, genre } = req.body;
    const { bookId } = req.params;

    if (!bookId || !isValidObjectId(bookId)) {
        return next(createHttpError(400, "user id is missing"));
    }
    if (!title || !description || !genre) {
        return next(
            createHttpError(400, "Title, description and genre are required")
        );
    }

    const book = await Book.findById(bookId);
    const public_id_of_old_coverImage: string = book?.coverImage
        ?.split("/")[7]
        ?.split(".")[0] as string;
    await deleteFromCloudinary(public_id_of_old_coverImage);

    const public_id_of_old_file: string = book?.file
        ?.split("/")[7]
        ?.split(".")[0] as string;

    await deleteFromCloudinary(public_id_of_old_file);

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
    const updateBook = await Book.findByIdAndUpdate(
        bookId,
        {
            $set: {
                title,
                description,
                genre,
                author: _req.user._id,
                coverImage: pdf.secure_url,
                file: coverImage.secure_url,
            },
        },
        { new: true }
    );

    // console.log(updateBook);

    if (!updateBook) {
        return next(createHttpError(400, "User does not updated"));
    }

    res.status(200).json({
        message: "book updated successful",
        book: updateBook,
    });
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
    // const sleep = await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
        // todo: add pagination.
        const book = await Book.find().populate("author", "name");
        res.json(book);
    } catch (error) {
        const err = error as Error;
        return next(
            createHttpError(500, err.message || "Error while getting a book")
        );
    }
};

const getSingleBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { bookId } = req.params;

    if (!bookId || !isValidObjectId(bookId)) {
        return next(createHttpError(400, "bookis is missing"));
    }

    try {
        const book = await Book.findOne({ _id: bookId }).populate(
            "author",
            "name"
        );
        if (!book) {
            return next(createHttpError(404, "Book not found."));
        }

        return res.json(book);
    } catch (error) {
        const err = error as Error;
        return next(
            createHttpError(500, err.message || "Error while getting a book")
        );
    }
};

export { createBook, updateBook, listBooks, getSingleBook };
