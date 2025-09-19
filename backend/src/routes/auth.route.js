import express from "express";
import { signup, login, logout, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import multer, { memoryStorage } from "multer"

const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer ({storage})

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/updateProfile", protectRoute,upload.single("profilePic"),updateProfile);

// ✅ Capital A to match frontend call
router.get("/checkAuth", protectRoute, checkAuth);

export default router;
