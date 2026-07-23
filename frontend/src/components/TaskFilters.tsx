import React from "react";
import type { TaskFilterParams } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, Plus } from "lucide-react";

interface TaskFiltersProps {
  filters: TaskFilterParams;
  onFilterChange: (newFilters: Partial<TaskFilterParams>) => void;
  onResetFilters: () => void;
  onOpenCreateModal: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onOpenCreateModal,
}) => {
  return (
    <div className="flex flex-col gap-4 bg-card p-4 rounded-xl border border-border/60 shadow-sm">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-9 bg-background"
          />
        </div>

        {/* Create Task Action Button */}
        <Button
          onClick={onOpenCreateModal}
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium gap-2 shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Create New Task
        </Button>
      </div>

      {/* Filter Options Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-border/40">
        {/* Status Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filter Status
          </label>
          <select
            value={filters.status || ""}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="h-9 px-3 py-1 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filter Priority
          </label>
          <select
            value={filters.priority || ""}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            className="h-9 px-3 py-1 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sort By
          </label>
          <select
            value={filters.sortBy || "newest"}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as "newest" | "oldest" | "dueDate",
              })
            }
            className="h-9 px-3 py-1 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="newest">Newest Created</option>
            <option value="oldest">Oldest Created</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex flex-col justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="h-9 text-xs text-muted-foreground hover:text-foreground gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
