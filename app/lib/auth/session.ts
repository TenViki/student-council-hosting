import { User } from "@prisma/client";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import prisma from "../prisma";

export async function createSession(user: User): Promise<string | void> {
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expires: new Date(Date.now() + 1000 * +process.env.SESSION_DURATION!),
    },
  });

  const sessionToken = await new SignJWT({ sessionId: session.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("findflow")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

  (await cookies()).set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
    expires: new Date(Date.now() + 60 * 60 * 24 * 365 * 1000), // 1 year from now
  });
}

export const getSession = async (token?: string) => {
  if (!token) return undefined;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));

    const sessionId = payload.sessionId as string;

    if (!sessionId) return undefined;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
      },
    });

    if (!session || (session.expires && session.expires < new Date())) return undefined;

    if (session.expires) {
      await prisma.session.update({
        where: { id: sessionId },
        data: {
          expires: new Date(Date.now() + 1000 * +process.env.SESSION_DURATION!),
        },
      });
    }

    return session;
  } catch (error) {
    return undefined;
  }
};
