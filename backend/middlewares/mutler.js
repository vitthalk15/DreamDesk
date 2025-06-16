import multer from "multer";

const storage = multer.memoryStorage();

// Single file upload for resume
export const singleUpload = multer({storage}).single("file");

// Multiple file upload for profile updates (resume and profile photo)
export const profileUpload = multer({storage}).fields([
    { name: 'file', maxCount: 1 },      // Resume file
    { name: 'profilePhoto', maxCount: 1 } // Profile photo
]);