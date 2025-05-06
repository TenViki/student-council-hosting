"use server";

import {exec} from "child_process";

export const listNetworks = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(`docker network ls`, (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Error listing networks: ${error.message}`);
        reject(error);
      }
      if (stderr) {
        console.error(`Error listing networks: ${stderr}`);
        reject(new Error(stderr));
      }
      console.log(`Networks: ${stdout}`);
      resolve(stdout);
    });
  });
}

export const createDockerNetwork = async (networkName: string) => {
  // check if the network already exists
  const networks = await listNetworks();
  if (networks.includes(networkName)) {
    console.log(`Network ${networkName} already exists.`);
    return;
  }

  return new Promise((resolve, reject) => {
    exec(`docker network create ${networkName}`, (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Error creating network: ${error.message}`);
        reject(error);
      }
      if (stderr) {
        console.error(`Error creating network: ${stderr}`);
        reject(new Error(stderr));
      }
      console.log(`Network created: ${stdout}`);
      resolve(stdout);
    });
  });
}

export const getTraefikId = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(`docker ps -q --filter "name=traefik"`, (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Error getting Traefik ID: ${error.message}`);
        reject(error);
      }
      if (stderr) {
        console.error(`Error getting Traefik ID: ${stderr}`);
        reject(new Error(stderr));
      }
      console.log(`Traefik ID: ${stdout}`);
      resolve(stdout.trim());
    });
  });
}

export const joinTraefikToNetwork = async (networkName: string, traefikId: string) => {
  return new Promise((resolve, reject) => {
    exec(`docker network connect ${networkName} ${traefikId}`, (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Error connecting Traefik to network: ${error.message}`);
        reject(error);
      }
      if (stderr) {
        console.error(`Error connecting Traefik to network: ${stderr}`);
        reject(new Error(stderr));
      }
      console.log(`Traefik connected to network: ${stdout}`);
      resolve(stdout);
    });
  }); 
}