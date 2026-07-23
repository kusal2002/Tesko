import { z } from "zod";
import { Priority, Status } from "@prisma/client";

const titleSchema = z
  .string()
  .min(1, "Title is required")
  .max(150, "Title must be less than 150 characters");

const descriptionSchema = z.string().optional().nullable();

const dueDateSchema = z
  .string()
  .min(1, "Due date is required")
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid due date format",
  });

const isNotInPast = (val: string): boolean => {
  const inputDate = new Date(val);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(Status),
  dueDate: dueDateSchema.refine(isNotInPast, {
    message: "Due date cannot be earlier than today",
  }),
});

// On update, every field is optional. The "not in the past" rule is
// intentionally NOT enforced here so an already-overdue task can still be
// edited (e.g. marked as completed) without being forced to change its date.
export const updateTaskSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema,
  priority: z.nativeEnum(Priority).optional(),
  status: z.nativeEnum(Status).optional(),
  dueDate: dueDateSchema.optional(),
});
