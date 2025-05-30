import { UserTypes } from "../user/userTypes";

export interface BookTypes {
    _id: string;
    title: string;
    description: string;
    author: UserTypes;
    coverImage: string;
    file: string;
    genre: string;
}
