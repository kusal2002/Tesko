import type { Response } from "express";
import { Priority, Status, type Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../validations/task.validation.js";

const parseParamId = (idParam: unknown): number => {
  const strId = Array.isArray(idParam) ? idParam[0] : String(idParam || "");
  return parseInt(strId, 10);
};

// Restrict a task lookup to the tasks owned by the authenticated user.
const ownedTaskWhere = (id: number, userId?: number): Prisma.TaskWhereInput =>
  userId ? { id, userId } : { id };

// GET /api/tasks (with Search, Filtering, Sorting)
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, status, priority, sortBy } = req.query;

    const where: Prisma.TaskWhereInput = {};

    if (req.user?.id) {
      where.userId = req.user.id;
    }

    if (search && typeof search === "string" && search.trim() !== "") {
      where.title = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    if (status && Object.values(Status).includes(status as Status)) {
      where.status = status as Status;
    }

    if (priority && Object.values(Priority).includes(priority as Priority)) {
      where.priority = priority as Priority;
    }

    let orderBy: Prisma.TaskOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "oldest") {
      orderBy = { createdAt: "asc" };
    } else if (sortBy === "dueDate") {
      orderBy = { dueDate: "asc" };
    } else if (sortBy === "newest") {
      orderBy = { createdAt: "desc" };
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// GET /api/tasks/stats (Dashboard statistics)
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userWhere: Prisma.TaskWhereInput = userId ? { userId } : {};

    const now = new Date();

    const [totalTasks, pendingTasks, inProgressTasks, completedTasks, overdueTasks] =
      await Promise.all([
        prisma.task.count({ where: userWhere }),
        prisma.task.count({ where: { ...userWhere, status: Status.PENDING } }),
        prisma.task.count({ where: { ...userWhere, status: Status.IN_PROGRESS } }),
        prisma.task.count({ where: { ...userWhere, status: Status.COMPLETED } }),
        prisma.task.count({
          where: {
            ...userWhere,
            status: { not: Status.COMPLETED },
            dueDate: { lt: now },
          },
        }),
      ]);

    res.json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard statistics" });
  }
};

// GET /api/tasks/:id
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseParamId(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid task ID" });
      return;
    }

    const task = await prisma.task.findFirst({
      where: ownedTaskWhere(id, req.user?.id),
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

// POST /api/tasks
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parseResult = createTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: "Validation Error",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { title, description, priority, status, dueDate } = parseResult.data;

    const taskData: Prisma.TaskCreateInput = {
      title,
      description: description || null,
      priority,
      status,
      dueDate: new Date(dueDate),
    };

    if (req.user?.id) {
      taskData.user = { connect: { id: req.user.id } };
    }

    const newTask = await prisma.task.create({
      data: taskData,
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseParamId(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid task ID" });
      return;
    }

    const existingTask = await prisma.task.findFirst({
      where: ownedTaskWhere(id, req.user?.id),
    });
    if (!existingTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const parseResult = updateTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: "Validation Error",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const data = parseResult.data;
    const updateData: Prisma.TaskUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseParamId(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid task ID" });
      return;
    }

    const existingTask = await prisma.task.findFirst({
      where: ownedTaskWhere(id, req.user?.id),
    });
    if (!existingTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
