import { z } from "zod";

export const CreateStudentCouncilSchema = z.object({
  name: z.string().min(1, { message: "Název je povinný" }),
  username: z.string().min(1, { message: "Uživatelské jméno je povinné" }),
  email: z.string().email({ message: "Neplatný formát e-mailu" }),
  subdomain: z.string().min(1, { message: "Subdoména je povinná" }).regex(/^[a-z0-9]+$/, {
    message: "Subdoména může obsahovat pouze malá písmena a číslice",
  }),
  school: z.string().min(1, { message: "Škola je povinná" }),
  logoId: z.string().optional(),
});