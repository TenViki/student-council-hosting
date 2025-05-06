"use server";

import { getAuth } from "@/lib/auth/dal";
import prisma from "@/lib/prisma";

export const getCouncil = async () => {
  const {user} = await getAuth();
  if (!user) {
    return null;
  }

  const council = await prisma.studentCouncil.findFirst({
    where: {
      members: {
        some: {
          id: {
            equals: user?.id,
          }
        }
      }
    },
    include: {
      members: {
        omit: {
          password: true,
        }
      },
      containers: true
    },
  });

  if (!council) {
    return null;
  }

  return council;
}