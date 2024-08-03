import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import passport from "passport";
import { __prod__ } from "./constants/global.constants";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import morganMiddleware from "./middlewares/winston.middleware";
import appRouter from "./routes";
import "./types/global.types";
import logger from "./utils/logger.utils";

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    maxAge: __prod__ ? 86400 : undefined,
    origin: JSON.parse(process.env.CORS_ORIGIN!),
    credentials: true, // Allows headers (cookies) //? Check CSRF
  })
);
app.use(cookieParser());

app.use(morganMiddleware);

app.use(passport.initialize());

app.use("/", appRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
