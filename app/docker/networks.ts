"use server";

import { runCommand } from "@/lib/cmd";
import {exec} from "child_process";

export const listNetworks = async (): Promise<string[]> => {
  const [res, err] = await runCommand(`docker network ls --format "{{.Name}}"`);

  if (err) {
    console.error(`Error listing networks: ${err}`);
    throw err;
  }

  console.log(`Networks: ${res}`);
  const networks = res!.split('\n').slice(1).map(line => line.split(/\s+/)[1]);
  return networks;
}

export const createDockerNetwork = async (networkName: string) => {
  // check if the network already exists
  const networks = await listNetworks();
  if (networks.includes(networkName)) {
    console.log(`Network ${networkName} already exists.`);
    return;
  }

  const [res, err] = await runCommand(`docker network create ${networkName}`);

  if (err) {
    console.error(`Error creating network: ${err}`);
    throw err;
  }

  return res;
}

export const getTraefikId = async (): Promise<string> => {
  const [res, err] = await runCommand(`docker ps -q --filter "name=traefik"`);

  if (err) {
    console.error(`Error getting Traefik ID: ${err}`);
    throw err;
  }

  if (!res) {
    console.error(`Traefik container not found.`);
    throw new Error("Traefik container not found.");
  }
  const traefikId = res.trim();
  console.log(`Traefik ID: ${traefikId}`);
  return traefikId;
}

export const joinContainerToNetwork = async (networkName: string, containerId: string) => {
  const [res, err] = await runCommand(`docker network connect ${networkName} ${containerId}`);

  if (err) {
    console.error(`Error connecting container to network: ${err}`);
    throw err;
  }

  return res!;
}