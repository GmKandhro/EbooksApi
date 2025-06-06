import mongoose from "mongoose";
import { BookTypes } from "./booktypes";

const bookSchema = new mongoose.Schema<BookTypes>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            require: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        file: {
            type: String,
            requied: true,
        },
        genre: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Book = mongoose.model<BookTypes>("Book", bookSchema);
