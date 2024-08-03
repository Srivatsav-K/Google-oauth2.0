import { Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { authenticateUser } from "../middlewares/authenticateUser.middleware";
import { googleAuthRouter } from "./google-auth.routes";
import { healthCheckRouter } from "./healthcheck.routes";
import { notesRouter } from "./notes.routes";
import { userInfoRouter } from "./userInfo.routes";

export const BASE_URL_V1 = "/api/v1";
const appRouter = Router();

// Health check
appRouter.use(`${BASE_URL_V1}/health-check`, healthCheckRouter);

appRouter.use(`${BASE_URL_V1}/auth/google`, googleAuthRouter);

appRouter.use(`${BASE_URL_V1}/user-info`, authenticateUser, userInfoRouter);

appRouter.use(`${BASE_URL_V1}/notes`, authenticateUser, notesRouter);

appRouter.all("*", (_, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: ReasonPhrases.NOT_FOUND });
});

export default appRouter;
