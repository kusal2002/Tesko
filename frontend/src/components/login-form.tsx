import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Lock, Mail, LogIn, Key } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name || "User"}!`);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@test.com");
    setPassword("123456");
    toast.info("Demo credentials loaded!");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border/60 shadow-xl backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-2 pb-6 border-b border-border/40">
          <div className="mx-auto w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-2 border border-amber-500/20">
            <LogIn className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Tesko Task Manager
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Sign in to access your task dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@test.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md transition-all h-10"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Demo Credentials
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleFillDemo}
              className="w-full flex items-center justify-center gap-2 text-xs border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
            >
              <Key className="w-3.5 h-3.5" /> Auto-fill Default Admin Credentials
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
