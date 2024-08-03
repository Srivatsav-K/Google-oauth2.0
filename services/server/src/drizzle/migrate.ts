import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import logger from "../utils/logger.utils";

const migrationClient = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
});

async function syncMigrationsWithDb() {
  try {
    const db = drizzle(migrationClient);

    logger.info("⏳ Running migrations...");

    const start = Date.now();

    await migrate(db, {
      migrationsFolder: "./src/drizzle/migrations",
    });

    const end = Date.now();

    logger.info(`✅ Migrations completed in ${end - start}ms`);
  } catch (e) {
    logger.error("❌ Migration failed");
    console.error(e);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

syncMigrationsWithDb();
