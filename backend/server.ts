import express from "express";
import cors from "cors";
import { env } from "./src/config/env.js";
import authRoutes from "./src/routes/auth.routes.js";
import taskRoutes from "./src/routes/task.routes.js";

const app = express();

app.use(cors({ origin: env.corsOrigins }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
