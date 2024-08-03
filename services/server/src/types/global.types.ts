/* eslint-disable @typescript-eslint/no-namespace */
import { DbUser } from "./user.types";

declare global {
  namespace Express {
    interface User extends DbUser {} // override passport.js user type

    interface Request {
      userId: string;
    }
  }
}
