import z from "zod";

export const authCookiesSchema = z.object({
  id: z.string(),
  rid: z.string(),
});
