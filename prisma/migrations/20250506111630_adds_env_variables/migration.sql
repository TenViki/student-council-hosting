-- AlterTable
ALTER TABLE "DockerContainer" ADD COLUMN     "envVariables" JSONB NOT NULL DEFAULT '{}';
