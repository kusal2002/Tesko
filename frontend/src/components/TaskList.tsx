import React from "react";
import type { Task, Status } from "@/types";
import { TaskCard } from "./TaskCard";
import { Inbox } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusToggle?: (task: Task, newStatus: Status) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onStatusToggle,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-48 rounded-xl border border-border/40 bg-card p-4 animate-pulse flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
            <div className="h-8 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-xl bg-card/50 my-4">
        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No tasks found</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-1">
          No tasks match your search or filter criteria. Try clearing filters or create a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusToggle={onStatusToggle}
        />
      ))}
    </div>
  );
};
