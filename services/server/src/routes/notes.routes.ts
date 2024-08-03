import { Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { listAllNotes } from "../controllers/notes.controller";

export const notesRouter = Router();

// /api/v1/notes
notesRouter.get("/", listAllNotes);

notesRouter.all("*", (_, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: ReasonPhrases.NOT_FOUND });
});
