-- CreateEnum
CREATE TYPE "MemoryType" AS ENUM ('ONBOARDING', 'JOURNAL', 'GOAL', 'REFLECTION', 'SYSTEM');

-- CreateTable
CREATE TABLE "MirrorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "timezone" TEXT,
    "onboardingAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MirrorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "type" "MemoryType" NOT NULL,
    "content" JSONB NOT NULL,
    "importance" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MirrorProfile_userId_key" ON "MirrorProfile"("userId");

-- AddForeignKey
ALTER TABLE "MirrorProfile" ADD CONSTRAINT "MirrorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "MirrorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
