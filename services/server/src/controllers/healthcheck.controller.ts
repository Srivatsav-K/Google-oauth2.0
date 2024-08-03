import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/ApiResponse.utils";

export const healthCheckController = (req: Request, res: Response) => {
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, ReasonPhrases.OK, "Health check passed")
    );
};
