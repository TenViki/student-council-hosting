"use server";

import { getAuth } from "@/lib/auth/dal";
import { UserLoginSchema } from "@/lib/def/UserLoginSchema";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export const getUserAction = async () => {
  const { user } = await getAuth();
  return user;
};

export const logoutUser = async () => {
  const { user, session } = await getAuth();
  if (!user) return;

  await prisma.session.delete({ where: { id: session.id } });
  redirect("/login");
};

export const loginUser = async (data: z.infer<typeof UserLoginSchema>) => {
  const validatedFields = UserLoginSchema.safeParse(data);
  // If any form fields are invalid, return early
  if (!validatedFields.success)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };

  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return {
      errors: {
        email: "User not found",
      },
    };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return {
      errors: {
        password: "Incorrect password",
      },
    };
  }

  await createSession(user);
  redirect("/dashboard");
};
