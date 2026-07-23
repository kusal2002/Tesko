import { PrismaClient, Priority, Status } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Returns a date offset from today by the given number of days (UTC midnight).
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
};

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@test.com",
      password: hashedPassword,
    },
  });

  // Only seed sample tasks the first time, so re-running the seed is idempotent.
  const existingTasks = await prisma.task.count({ where: { userId: admin.id } });
  if (existingTasks === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: "Prepare project documentation",
          description: "Write the README and API documentation for the assessment.",
          priority: Priority.HIGH,
          status: Status.IN_PROGRESS,
          dueDate: daysFromNow(2),
          userId: admin.id,
        },
        {
          title: "Design database schema",
          description: "Model the Users and Tasks tables with Prisma.",
          priority: Priority.MEDIUM,
          status: Status.COMPLETED,
          dueDate: daysFromNow(-3),
          userId: admin.id,
        },
        {
          title: "Implement authentication",
          description: "JWT login with hashed passwords.",
          priority: Priority.HIGH,
          status: Status.COMPLETED,
          dueDate: daysFromNow(-1),
          userId: admin.id,
        },
        {
          title: "Build dashboard statistics",
          description: "Show total, pending, in progress, completed and overdue counts.",
          priority: Priority.MEDIUM,
          status: Status.PENDING,
          dueDate: daysFromNow(5),
          userId: admin.id,
        },
        {
          title: "Fix overdue task styling",
          description: "Highlight tasks whose due date has passed.",
          priority: Priority.LOW,
          status: Status.PENDING,
          dueDate: daysFromNow(-2),
          userId: admin.id,
        },
      ],
    });
    console.log("Seeded admin user and sample tasks");
  } else {
    console.log("Seeded admin user (sample tasks already present)");
  }
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
