/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, sql } from "drizzle-orm";
import { Response } from "express";
import * as jwt from "jsonwebtoken";
import { __prod__ } from "../constants/global.constants";
import { db } from "../drizzle/db";
import { Users } from "../drizzle/schema";
import { AccessTokenData, RefreshTokenData } from "../types/auth.types";
import { DbUser } from "../types/user.types";

const cookieOpts = {
  httpOnly: true,
  secure: __prod__,
  sameSite: "lax",
  path: "/",
  domain: __prod__ ? `.${process.env.DOMAIN}` : "",
  maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 year
} as const;

const createAuthTokens = (
  user: DbUser
): { refreshToken: string; accessToken: string } => {
  const refreshToken = jwt.sign(
    { userId: user.id, refreshTokenVersion: user.refreshTokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "30d",
    }
  );

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15min",
    }
  );

  return { refreshToken, accessToken };
};

export const sendAuthCookies = (res: Response, user: DbUser) => {
  const { accessToken, refreshToken } = createAuthTokens(user);
  res.cookie("id", accessToken, cookieOpts);
  res.cookie("rid", refreshToken, cookieOpts);
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("id", cookieOpts);
  res.clearCookie("rid", cookieOpts);
};

export const checkTokens = async (
  accessToken: string,
  refreshToken: string
) => {
  try {
    // verify
    const data = <AccessTokenData>(
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!)
    );

    // get userId from token data
    return {
      userId: data.userId,
    };
  } catch (e: any) {
    if (e?.message === "invalid signature") {
      // Token signed with a different secret
      throw new Error(e.message);
    }

    // token is expired, so now check refresh token
  }

  // 1. verify refresh token
  let data: RefreshTokenData;
  try {
    data = <RefreshTokenData>(
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
    );
  } catch (e: any) {
    throw new Error(e?.message);
  }

  // 2. get user
  const user = await db.query.Users.findFirst({
    where: eq(Users.id, data.userId),
  });

  // 3.check refresh token version
  if (!user || user.refreshTokenVersion !== data.refreshTokenVersion) {
    throw new Error("Invalid token version");
  }

  // 4. update refreshToken version
  await db.update(Users).set({
    refreshTokenVersion: sql`${Users.refreshTokenVersion} + 1`,
  });

  return {
    userId: data.userId,
    user,
  };
};
