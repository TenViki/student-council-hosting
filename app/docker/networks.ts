"use server";

export const createDockerNetwork = async (networkName: string) => {
  const { exec } = require("child_process");

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