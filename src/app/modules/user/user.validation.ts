import z from "zod";
export const userValidation = z.object({
  email: z.string({ required_error: "Email required" }).email(),
  password: z.string({ required_error: "Password required" }),
  profileImg: z.string().optional(),
  userName: z.string({ required_error: "Username required" }),
});
