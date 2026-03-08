import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { convertImages } from "../controllers/convertController.js";

const router = express.Router();

router.post("/", upload.array("images", 50), convertImages);

export default router;