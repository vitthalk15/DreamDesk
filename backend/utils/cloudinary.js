import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
    resource_type: 'auto'
});

// Configure default upload options
cloudinary.config({
    upload_preset: "ml_default",
    resource_type: "auto",
    allowed_formats: ["pdf", "doc", "docx"],
    max_file_size: 5242880 // 5MB in bytes
});

export default cloudinary;