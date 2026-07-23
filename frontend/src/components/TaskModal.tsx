import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Calendar, AlertCircle } from "lucide-react";
import { format, startOfDay, isBefore } from "date-fns";

const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title must be under 150 characters"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"] as const, {
    message: "Priority is required",
  }),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"] as const, {
    message: "Status is required",
  }),
  dueDate: z.string().min(1, "Due date is required"),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  taskToEdit?: Task | null;
  isSubmitting?: boolean;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "PENDING",
      dueDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || "",
        priority: taskToEdit.priority,
        status: taskToEdit.status,
        dueDate: format(new Date(taskToEdit.dueDate), "yyyy-MM-dd"),
      });
    } else {
      reset({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "PENDING",
        dueDate: format(new Date(), "yyyy-MM-dd"),
      });
    }
  }, [taskToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: TaskFormData) => {
    // New tasks cannot be scheduled in the past. Existing (possibly overdue)
    // tasks are allowed to keep their original due date while being edited.
    if (!taskToEdit && isBefore(new Date(data.dueDate), startOfDay(new Date()))) {
      setError("dueDate", {
        type: "manual",
        message: "Due date cannot be earlier than today",
      });
      return;
    }
    await onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <h2 className="text-lg font-bold text-foreground">
            {taskToEdit ? "Edit Task" : "Create New Task"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          {/* Title Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g. Implement User Authentication"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.title.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add details or context for this task..."
              {...register("description")}
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                {...register("priority")}
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              {errors.priority && (
                <p className="text-xs text-red-500">{errors.priority.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              {errors.status && (
                <p className="text-xs text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Due Date Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> Due Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              {...register("dueDate")}
              className={errors.dueDate ? "border-red-500" : ""}
            />
            {errors.dueDate && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.dueDate.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-sm"
            >
              {isSubmitting
                ? "Saving..."
                : taskToEdit
                ? "Update Task"
                : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
