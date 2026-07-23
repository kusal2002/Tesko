import { Router } from "express";
import {
  getTasks,
  getDashboardStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all task endpoints with JWT auth middleware
router.use(authenticateToken);

router.get("/stats", getDashboardStats);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
