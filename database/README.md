# Database

PostgreSQL is the database for this project. The schema is defined and managed
with Prisma (`backend/prisma/schema.prisma`).

## Files

- **`schema.sql`** — a complete SQL dump of the schema (enums, `User` and `Task`
  tables, indexes and foreign keys). Use this if you want to create the schema
  manually without Prisma.

## Setup options

Pick **one** of the following.

### Option A — Prisma (recommended)

From the `backend/` directory:

```bash
npx prisma migrate deploy   # applies backend/prisma/migrations
# or, for a quick sync without migration history:
npx prisma db push
```

Then seed the default admin user and sample tasks:

```bash
npm run db:seed
```

### Option B — Raw SQL

Create the database, then run the dump:

```bash
createdb tesko_db
psql -d tesko_db -f database/schema.sql
```

You will still need to run `npm run db:seed` from `backend/` (or insert a user
manually with a bcrypt-hashed password) before you can log in.

## Default credentials

The seed creates a user you can log in with:

- **Email:** `admin@test.com`
- **Password:** `123456`
