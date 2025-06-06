import { Router } from "express";
import {
    createBook,
    updateBook,
    listBooks,
    getSingleBook,
    deleteBook,
} from "./bookController";
import multer from "multer";
import path from "node:path";

import { auth } from "../middlewares/auth";

const bookRouter = Router();

const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/uploads/"),
    limits: { fileSize: 3e7 },
});

bookRouter.post(
    "/",
    auth,
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1,
        },
        {
            name: "file",
            maxCount: 1,
        },
    ]),
    createBook
);

bookRouter.patch(
    "/update/:bookId",
    auth,
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1,
        },
        {
            name: "file",
            maxCount: 1,
        },
    ]),
    updateBook
);

bookRouter.get("/getAll", listBooks);
bookRouter.delete("/delete/:bookId", deleteBook);
bookRouter.get("/book/:bookId", getSingleBook);
export { bookRouter };
