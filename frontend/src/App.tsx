import { useState, useEffect, useCallback } from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/login-form";
import { Navbar } from "@/components/Navbar";
import { DashboardStats } from "@/components/DashboardStats";
import { TaskFilters } from "@/components/TaskFilters";
import { TaskList } from "@/components/TaskList";
import { TaskModal } from "@/components/TaskModal";
import type { Task, DashboardStats as StatsType, TaskFilterParams, Status } from "@/types";
import { api } from "@/lib/api";
import { Toaster, toast } from "sonner";
import { Loader2 } from "lucide-react";

function MainDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [isTasksLoading, setIsTasksLoading] = useState<boolean>(true);
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [filters, setFilters] = useState<TaskFilterParams>({
    search: "",
    status: "",
    priority: "",
    sortBy: "newest",
  });

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const res = await api.get<StatsType>("/tasks/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setIsTasksLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.sortBy) params.sortBy = filters.sortBy;

      const res = await api.get<Task[]>("/tasks", { params });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
      toast.error("Failed to load tasks");
    } finally {
      setIsTasksLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStats();
    fetchTasks();
  }, [fetchStats, fetchTasks]);

  const handleFilterChange = (newFilters: Partial<TaskFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "",
      priority: "",
      sortBy: "newest",
    });
    toast.info("Filters reset");
  };

  const handleCreateTask = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.post("/tasks", data);
      toast.success("Task created successfully!");
      fetchTasks();
      fetchStats();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to create task";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!taskToEdit) return;
    setIsSubmitting(true);
    try {
      await api.put(`/tasks/${taskToEdit.id}`, data);
      toast.success("Task updated successfully!");
      fetchTasks();
      fetchStats();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update task";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted!");
      fetchTasks();
      fetchStats();
    } catch (err: any) {
      toast.error("Failed to delete task");
    }
  };

  const handleStatusToggle = async (task: Task, newStatus: Status) => {
    try {
      await api.put(`/tasks/${task.id}`, { status: newStatus });
      toast.success(`Task marked as ${newStatus.replace("_", " ")}!`);
      fetchTasks();
      fetchStats();
    } catch (err: any) {
      toast.error("Failed to update status");
    }
  };

  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-8 space-y-8 max-w-7xl">
        {/* Dashboard Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Overview Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Track and manage your daily tasks, priorities, and deadlines.
          </p>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats stats={stats} isLoading={isStatsLoading} />

        {/* Task Management Section */}
        <div className="space-y-6 pt-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">Tasks Management</h3>
            <p className="text-sm text-muted-foreground">
              Filter, search, create, and update your task items.
            </p>
          </div>

          <TaskFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onOpenCreateModal={openCreateModal}
          />

          <TaskList
            tasks={tasks}
            isLoading={isTasksLoading}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
            onStatusToggle={handleStatusToggle}
          />
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={taskToEdit ? handleUpdateTask : handleCreateTask}
        taskToEdit={taskToEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    );
  }

  return <MainDashboard />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}
