import { runCommand } from "@/lib/cmd";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import { getContainerId } from "./networks";

const createCouncilDirectoryIfNotExists = async (councilId: string) => {
  const containerDirectory = process.env.CONTAINERS_DIR;

  if (!containerDirectory) {
    throw new Error("CONTAINERS_DIR environment variable is not set");
  }

  const councilDirectory = `${containerDirectory}/${councilId}`;
  try {
    await fs.mkdir(councilDirectory, { recursive: true });
    return councilDirectory;
  } catch (error) {
    console.error(`Error creating directory ${councilDirectory}:`, error);
    throw new Error(`Failed to create directory for council ${councilId}`);
  }
}

export const setupCompose = async (councilId: string) => {
  const council = await prisma.studentCouncil.findUnique({
    where: { id: councilId },
    include: {
      containers: true,
    },
  });

  if (!council) throw new Error("Council not found");

  // Create a new Docker Compose file
  const composeFile = {
    services: {} as Record<string, any>,
    networks: {
      [council.dockerNetwork]: {
        external: true,
      },
    },
  };

  // Loop through each container in the council
  for (const container of council.containers) {
    const labels = [] as string[];

    if (container.isWebsite) {
      labels.push("traefik.enable=true");
      labels.push(`traefik.http.routers.${council.id}.rule=Host(\`${council.subdomain}.${process.env.DOMAIN}\`)`);
      labels.push(`traefik.http.services.${council.id}.loadbalancer.server.port=80`);
    } else {
      labels.push("traefik.enable=false");
    }

    // Add the container to the Docker Compose file
    composeFile.services[container.name.toLowerCase()] = {
      image: container.image,
      hostname: container.hostname || undefined,
      environment: container.envVariables,
      networks: [council.dockerNetwork],
      labels: labels,
    };
  }

  // Save the Docker Compose file to the council's directory
  const dir = await createCouncilDirectoryIfNotExists(councilId);

  const composeFilePath = `${dir}/docker-compose.json`;

  try {
    await fs.writeFile(composeFilePath, JSON.stringify(composeFile, null, 2));
    console.log(`Docker Compose file created at ${composeFilePath}`);
  } catch (error) {
    console.error(`Error writing Docker Compose file:`, error);
    throw new Error(`Failed to create Docker Compose file for council ${councilId}`);
  }
}

export const runCompose = async (councilId: string) => {
  const council = await prisma.studentCouncil.findUnique({
    where: { id: councilId },
    include: {
      containers: true,
    },
  });

  if (!council) throw new Error("Council not found");

  const dir = await createCouncilDirectoryIfNotExists(councilId);

  // Run the Docker Compose command
  const [res, err] = await runCommand(`docker compose -f ${dir}/docker-compose.json --progress json up -d`, { cwd: dir, redirectStderr: true, onStdout: (out) => {
    const parsed = JSON.parse(out);
    // TODO: Stream the output to the client
    console.log(parsed);
    // {"id":"Container cmaccmnsd000fg0pldqokkxwu-wordpress-1","status":"Creating"}
  }});

  if (err) {
    console.error(`Error running Docker Compose:`, err);
    // throw new Error(`Failed to run Docker Compose for council ${councilId}`);
  }

  for (const container of council.containers) {
    const imageName = `${council.id}-${container.name.toLowerCase()}`;
    const containerId = await getContainerId(imageName);

    await prisma.dockerContainer.update({
      where: { id: container.id },
      data: {
        containerId,
      },
    });
  }

  console.log(`Docker Compose started for council ${councilId}`);
  return {
    res, err
  }
}