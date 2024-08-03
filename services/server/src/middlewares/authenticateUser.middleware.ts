/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/ApiResponse.utils";
import { checkTokens, sendAuthCookies } from "../utils/auth.utils";
import { authCookiesSchema } from "../validators/auth.validators";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { data, error } = authCookiesSchema.safeParse(req.cookies);
  if (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        new ApiResponse(
          StatusCodes.UNAUTHORIZED,
          { error: "Authorization token is missing" },
          ReasonPhrases.UNAUTHORIZED
        )
      );
  }

  try {
    const { id, rid } = data;
    const { userId, user } = await checkTokens(id, rid);

    req.userId = userId;
    if (user) {
      sendAuthCookies(res, user);
      req.user = user;
    }

    next();
  } catch (e: any) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        new ApiResponse(
          StatusCodes.UNAUTHORIZED,
          { error: e?.message || ReasonPhrases.UNAUTHORIZED },
          ReasonPhrases.UNAUTHORIZED
        )
      );
  }
};
