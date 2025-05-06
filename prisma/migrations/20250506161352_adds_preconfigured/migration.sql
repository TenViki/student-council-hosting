/*
  Warnings:

  - Added the required column `preconfigured` to the `DockerContainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DockerContainer" ADD COLUMN     "preconfigured" BOOLEAN NOT NULL,
ALTER COLUMN "isWebsite" SET DEFAULT false,
ALTER COLUMN "isDatabase" SET DEFAULT false;
