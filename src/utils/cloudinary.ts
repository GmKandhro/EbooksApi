import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

import fs from "fs";
import { config } from "../config/config";

// Cloudinary Configuration
cloudinary.config({
    cloud_name: config.cloudinary_cloudName,
    api_key: config.cloudinary_apiKey,
    api_secret: config.cloudinary_apiSecret,
});

export const uploadOnCloudinary = async (
    localFilePath: string
): Promise<UploadApiResponse | null> => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "EbooksData",
        });

        fs.unlinkSync(localFilePath); // Delete the local file after upload
        return response;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Clean up if file still exists
        }

        return null;
    }
};

export const deleteFromCloudinary = async (
    public_id: string
): Promise<unknown | null> => {
    try {
        if (!public_id) return null;

        const response = await cloudinary.uploader.destroy(public_id);
        return response;
    } catch (error) {
        console.error("Cloudinary Deletion Error:", error);
        return null;
    }
};
