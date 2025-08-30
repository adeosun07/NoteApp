import express from "express";
import noteControllers from "../controllers/noteController.js";
import authMiddleware from "../middleware/auth.js"; // <-- make sure you have this

const router = express.Router();

router.get("/", authMiddleware, noteControllers.getNotes);
router.post("/create-note", authMiddleware, noteControllers.createNote);
router.delete("/:noteId", authMiddleware, noteControllers.deleteNote);

export default router;
