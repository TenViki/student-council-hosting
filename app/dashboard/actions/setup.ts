"use server";

import { getAuth } from "@/lib/auth/dal";
import prisma from "@/lib/prisma";
import { getCouncil } from "./council";
import { runCompose, setupCompose } from "@/docker/compose";

export const setup = async (stackId: string) => {
  switch (stackId) {
    case "wordpress":
      await setupWordpress();
      break;
    // case "joomla":
    //   await setupJoomla();
    //   break;
    // case "html-css":
    //   await setupHtmlCss();
    //   break;
    // case "custom":
    //   await setupCustom();
    //   break;
    default:
      throw new Error("Unknown stack id");
  }
}

export const setupWordpress = async () => {
  const {user} = await getAuth();
  const council = await getCouncil(); 
  if (!council || !user) throw new Error("Council not found");

  const mysqlPassword = Math.random().toString(36).slice(-8);
  const mysqlUser = "wordpress";
  const mysqlDatabase = "wordpress";
  const mysqlHostname = "mysql_" + council.id;

  const wordpressContainer = await prisma.dockerContainer.create({
    data: {
      name: "Wordpress",
      image: "wordpress:latest",
      councilId: council.id,
      isWebsite: true,
      isDatabase: false,
      envVariables: {
        WORDPRESS_DB_HOST: `${mysqlHostname}:3306`,
        WORDPRESS_DB_USER: mysqlUser,
        WORDPRESS_DB_PASSWORD: mysqlPassword,
        WORDPRESS_DB_NAME: mysqlDatabase,
      }
    }
  });

  const mysqlContainer = await prisma.dockerContainer.create({
    data: {
      name: "MySQL",
      image: "mysql:latest",
      hostname: mysqlHostname,
      councilId: council.id,
      isWebsite: false,
      isDatabase: true,
      envVariables: {
        MYSQL_ROOT_PASSWORD: mysqlPassword,
        MYSQL_USER: mysqlUser,
        MYSQL_PASSWORD: mysqlPassword,
        MYSQL_DATABASE: mysqlDatabase,
      }
    }
  });

  console.log("Settig up compose...");
  await setupCompose(council.id);
  await runCompose(council.id);
}