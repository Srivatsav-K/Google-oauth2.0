import { Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { healthCheckController } from "../controllers/healthcheck.controller";

export const healthCheckRouter = Router();

healthCheckRouter.get("/", healthCheckController);

healthCheckRouter.all("*", (_, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: ReasonPhrases.NOT_FOUND });
});
