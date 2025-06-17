import express from "express";
import { login, logout, register, updateProfile, deleteResume, switchRole, resetPassword, getResume } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, profileUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
    res.status(200).json({ message: "User route is working" });
});

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, profileUpload, updateProfile);
router.route("/profile/resume").get(isAuthenticated, getResume);
router.route("/profile/resume").delete(isAuthenticated, deleteResume);
router.route("/role/switch").post(isAuthenticated, switchRole);
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

