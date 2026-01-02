-- CreateEnum
CREATE TYPE "MemoryStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'CONTRADICTED');

-- AlterTable
ALTER TABLE "Memory" ADD COLUMN     "status" "MemoryStatus" NOT NULL DEFAULT 'ACTIVE';
