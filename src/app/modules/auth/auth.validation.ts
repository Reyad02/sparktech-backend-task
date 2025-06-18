import z from "zod";
export const authValidation = z.object({
  email: z.string({ required_error: "Email required" }).email(),
  password: z.string({ required_error: "Password required" }),
});