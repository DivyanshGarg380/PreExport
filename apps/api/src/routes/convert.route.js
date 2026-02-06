import express from "express";
import { convertSheetToExcel, getAvailableSheets, getSheetPreview } from "../controllers/convert.controller.js";

const router = express.Router();

router.post("/", convertSheetToExcel);
router.get("/", getAvailableSheets);
router.get("/:sheetId", getSheetPreview);

export default router;