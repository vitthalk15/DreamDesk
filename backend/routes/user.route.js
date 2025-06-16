import express from "express";
import { login, logout, register, updateProfile, deleteResume, switchRole, resetPassword } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, profileUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,profileUpload,updateProfile);
router.route("/profile/resume").delete(isAuthenticated,deleteResume);
router.route("/profile/role").patch(isAuthenticated,switchRole);
router.route("/reset-password").post(resetPassword);

// Health check endpoint for deployment
router.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "success", 
        message: "DreamDesk Backend is running",
        timestamp: new Date().toISOString()
    });
});

export default router;

