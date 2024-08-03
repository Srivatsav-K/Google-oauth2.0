import { eq } from "drizzle-orm";
import { Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../drizzle/db";
import { Users } from "../drizzle/schema";
import { clearAuthCookies, sendAuthCookies } from "../utils/auth.utils";

export const googleAuthRouter = Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.API_URL}/api/v1/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      // 1. grab id
      const googleId = profile._json.sub;

      // 2. db lookup
      let user = await db.query.Users.findFirst({
        where: eq(Users.googleId, googleId),
      });

      // 3. create user if not exists
      if (!user) {
        [user] = await db
          .insert(Users)
          .values({
            name: profile._json.name as string,
            email: profile._json.email as string,
            googleId,
          })
          .returning();
      }

      // 4. return user
      done(null, user);
    }
  )
);

// /api/v1/auth/google
googleAuthRouter.get("/", (req, res, next) => {
  const { redirectUrl = "/" } = req.query;
  const state = redirectUrl
    ? Buffer.from(JSON.stringify({ redirectUrl })).toString("base64")
    : undefined;

  const authenticator = passport.authenticate("google", {
    session: false,
    state,
  });

  authenticator(req, res, next);
});

// /api/v1/auth/google/callback
googleAuthRouter.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    //@ts-expect-error "add global user type to user"
    sendAuthCookies(res, req.user);

    const { state } = req.query;
    const { redirectUrl } = JSON.parse(
      Buffer.from(state as string, "base64").toString()
    );
    if (typeof redirectUrl === "string") {
      return res.redirect(redirectUrl);
    }

    res.redirect("/");
  }
);

// /api/v1/auth/google/signout
googleAuthRouter.get("/signout", (req, res) => {
  const { redirectUrl = "/" } = req.query;
  clearAuthCookies(res);
  res.redirect(redirectUrl as string);
});

googleAuthRouter.all("*", (_, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: ReasonPhrases.NOT_FOUND });
});
