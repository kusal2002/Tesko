import React, { useState } from "react";
import type { Task, Priority, Status } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle, Edit, Trash2, Clock, CheckCircle2 } from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusToggle?: (task: Task, newStatus: Status) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusToggle,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const dueDate = new Date(task.dueDate);
  const isOverdue =
    task.status !== "COMPLETED" && isBefore(dueDate, startOfDay(new Date()));

  const priorityStyles: Record<Priority, string> = {
    LOW: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    HIGH: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  const statusStyles: Record<Status, string> = {
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    IN_PROGRESS: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      setIsDeleting(true);
      onDelete(task.id);
    }
  };

  return (
    <Card className="flex flex-col justify-between border-border/60 shadow-sm hover:shadow-md transition-all group bg-card">
      <CardHeader className="p-4 pb-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Priority Badge */}
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${priorityStyles[task.priority]}`}>
            {task.priority} Priority
          </span>

          {/* Status Badge */}
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${statusStyles[task.status]}`}>
            {task.status === "COMPLETED" && <CheckCircle2 className="w-3 h-3" />}
            {task.status === "IN_PROGRESS" && <Clock className="w-3 h-3 animate-spin" />}
            {task.status.replace("_", " ")}
          </span>
        </div>

        <h3 className="text-base font-bold tracking-tight text-foreground line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {task.title}
        </h3>
      </CardHeader>

      <CardContent className="p-4 pt-1 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {task.description || "No description provided."}
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>{format(dueDate, "MMM dd, yyyy")}</span>
          </div>

          {isOverdue && (
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              <AlertCircle className="w-3 h-3" /> Overdue
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-2 border-t border-border/40 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-1">
          {onStatusToggle && task.status !== "COMPLETED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusToggle(task, "COMPLETED")}
              className="text-xs h-7 px-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            >
              Mark Done
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Edit task"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 w-8 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
