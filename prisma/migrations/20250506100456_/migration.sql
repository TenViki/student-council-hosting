/*
  Warnings:

  - Added the required column `containerId` to the `DockerContainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DockerContainer" ADD COLUMN     "containerId" TEXT NOT NULL,
ALTER COLUMN "directory" DROP NOT NULL;
