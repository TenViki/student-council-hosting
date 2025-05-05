-- AlterTable
ALTER TABLE "User" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "councilId" TEXT;

-- CreateTable
CREATE TABLE "StudentCouncil" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dockerNetwork" TEXT NOT NULL,

    CONSTRAINT "StudentCouncil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DockerContainer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "councilId" TEXT,
    "isWebsite" BOOLEAN NOT NULL,
    "isDatabase" BOOLEAN NOT NULL,
    "directory" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "DockerContainer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentCouncil_subdomain_key" ON "StudentCouncil"("subdomain");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_councilId_fkey" FOREIGN KEY ("councilId") REFERENCES "StudentCouncil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DockerContainer" ADD CONSTRAINT "DockerContainer_councilId_fkey" FOREIGN KEY ("councilId") REFERENCES "StudentCouncil"("id") ON DELETE SET NULL ON UPDATE CASCADE;
