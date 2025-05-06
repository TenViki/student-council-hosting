import { cookies, headers } from "next/headers";
import "server-only";
import { getSession } from "./session";
import { redirect as nextRedirect } from "next/navigation";
import { cache } from "react";

export const getAuth = cache(async (redirect: boolean = false) => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await getSession(cookie);

  if (!session) {
    if (redirect) {
      const h = await headers();
      const referer = h.get("x-pathname");
      console.log("Refering to", referer);
      const urlEncoded = encodeURIComponent(referer || "/");

      nextRedirect(`/login?to=${urlEncoded}`); // TODO: Maybe in the future add ?redirect=xxx
    }

    return { user: null };
  }

  return { user: session?.user, session };
});
