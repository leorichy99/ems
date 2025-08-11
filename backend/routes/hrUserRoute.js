// routes/users.js
import express from "express";
import { addEmployee } from "../controllers/hrUserController.js";

const router = express.Router();

router.post("/", addEmployee);

export default router;
