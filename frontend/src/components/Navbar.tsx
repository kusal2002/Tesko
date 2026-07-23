import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckSquare, LogOut, User as UserIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold shadow-md">
            <CheckSquare className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Tesko <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Task System</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg text-muted-foreground hover:text-foreground"
            title="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user && (
            <div className="flex items-center gap-3 border-l border-border/60 pl-4">
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <UserIcon className="h-4 w-4 text-amber-500" />
                <span className="text-foreground">{user.name || user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-2 border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
