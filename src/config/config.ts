import { config as conf } from "dotenv";

conf();

const _config = {
    port: process.env.PORT,
    mongodbUrl: process.env.MONGODB_URL,
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SCRECT,
    cloudinary_cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_apiKey: process.env.CLOUDINARY_API_KEY,
    cloudinary_apiSecret: process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config);
