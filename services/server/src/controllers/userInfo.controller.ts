import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { db } from "../drizzle/db";
import { Users } from "../drizzle/schema";

export const getUserInfo = async (req: Request, res: Response) => {
  const userId = req.userId;

  const userInfo = await db.query.Users.findFirst({
    where: eq(Users.id, userId),
  });

  res.status(StatusCodes.OK).json(userInfo);
};
