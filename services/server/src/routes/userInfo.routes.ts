import { Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getUserInfo } from "../controllers/userInfo.controller";

export const userInfoRouter = Router();

userInfoRouter.get("/", getUserInfo);

userInfoRouter.all("*", (_, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: ReasonPhrases.NOT_FOUND });
});
