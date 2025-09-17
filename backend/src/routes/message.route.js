import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessages, deleteMessage } from "../controllers/message.controller.js"; 
// 👆 make sure deleteMessage is exported from your controller

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessages);

// 🆕 Delete message route
router.delete("/:id", protectRoute, deleteMessage);

export default router;
