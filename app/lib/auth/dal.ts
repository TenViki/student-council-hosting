import { cookies } from "next/headers";
import "server-only";
import { getSession } from "./session";
import { redirect as nextRedirect } from "next/navigation";
import { cache } from "react";

export const getAuth = cache(async (redirect: boolean = false) => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await getSession(cookie);

  if (!session) {
    if (redirect) {
      nextRedirect("/login"); // TODO: Maybe in the future add ?redirect=xxx
    }

    return { user: null };
  }

  // if (authLevel && !authLevel.includes(session.user.role)) {
  //   nextRedirect("/403");

  //   // return { user: null };
  // }

  return { user: session?.user, session };
});
