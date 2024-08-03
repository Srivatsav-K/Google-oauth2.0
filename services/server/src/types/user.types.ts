import { Users } from "../drizzle/schema";

export type DbUser = typeof Users.$inferSelect;
