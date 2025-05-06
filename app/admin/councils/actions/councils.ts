"use server";

import { z } from "zod";
import { CreateStudentCouncilSchema } from "../def/CreateStudentCouncilSchema";
import { getAuth } from "@/lib/auth/dal";
import prisma from "@/lib/prisma";
import { createHashedPassword } from "@/lib/auth/password";
import { createDockerNetwork, getContainerId, joinContainerToNetwork } from "@/docker/networks";

export const createCouncil = async (data: z.infer<typeof CreateStudentCouncilSchema>) => {
  const { user } = await getAuth();
  if (!user || !user.admin) throw new Error("Unauthorized");

  const validatedFields = CreateStudentCouncilSchema.safeParse(data);
    // If any form fields are invalid, return early
    if (!validatedFields.success)
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };

  const { name, subdomain, school, logoId } = data;

  // Check if the subdomain already exists
  const existingCouncil = await prisma.studentCouncil.findUnique({
    where: {
      subdomain,
    },
  });
  if (existingCouncil) {
    return {
      errors: {
        subdomain: "Subdoména již existuje",
      },
    };
  }

  const council = await prisma.studentCouncil.create({
    data: {
      name,
      subdomain,
      school,
      logoId,
      dockerNetwork: `${subdomain}-network`,
    },
  });

  const generatedPassword = Math.random().toString(36).slice(-8);

  // create associated account for the council
  const createdUser = await prisma.user.create({
    data: {
      email: data.email,
      password: await createHashedPassword(generatedPassword),
      name: data.username,
      councilId: council.id,
    },
  });

  // create a docker network
  await createDockerNetwork(council.dockerNetwork);
  const traefikId = await getContainerId("traefik");
  await joinContainerToNetwork(council.dockerNetwork, traefikId);

  return {
    errors: null,
    council,
    user: {
      email: createdUser.email,
      password: generatedPassword,
    }
  };
}