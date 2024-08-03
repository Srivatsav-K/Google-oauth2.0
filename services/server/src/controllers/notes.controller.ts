import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { db } from "../drizzle/db";
import { Notes } from "../drizzle/schema";

export const listAllNotes = async (req: Request, res: Response) => {
  const userId = req.userId;

  const notes = await db.query.Notes.findMany({
    where: eq(Notes.userId, userId),
  });

  res.status(StatusCodes.OK).json(notes);
};
