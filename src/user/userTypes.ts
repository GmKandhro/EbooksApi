export interface UserTypes {
    _id: string;
    name: string;
    email: string;
    password: string;
    isPasswordCorrect: (password: string) => boolean;
}
