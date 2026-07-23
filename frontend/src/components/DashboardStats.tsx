import React from "react";
import type { DashboardStats as StatsType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { ListTodo, Clock, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

interface DashboardStatsProps {
  stats: StatsType | null;
  isLoading: boolean;
  onFilterClick?: (status?: string, isOverdue?: boolean) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isLoading }) => {
  const statItems = [
    {
      title: "Total Tasks",
      value: stats?.totalTasks ?? 0,
      icon: ListTodo,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Pending Tasks",
      value: stats?.pendingTasks ?? 0,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "In Progress",
      value: stats?.inProgressTasks ?? 0,
      icon: Loader2,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      title: "Completed Tasks",
      value: stats?.completedTasks ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Overdue Tasks",
      value: stats?.overdueTasks ?? 0,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className={`border ${item.border} shadow-sm bg-card hover:shadow-md transition-all`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {item.title}
                </p>
                <div className="text-2xl font-bold tracking-tight">
                  {isLoading ? (
                    <span className="inline-block w-8 h-6 bg-muted animate-pulse rounded" />
                  ) : (
                    item.value
                  )}
                </div>
              </div>
              <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
