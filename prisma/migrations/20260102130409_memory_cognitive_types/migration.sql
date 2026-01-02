/*
  Warnings:

  - You are about to drop the column `type` on the `Memory` table. All the data in the column will be lost.
  - Added the required column `cognitiveType` to the `Memory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Memory_type_idx";

-- AlterTable
ALTER TABLE "Memory" DROP COLUMN "type",
ADD COLUMN     "cognitiveType" TEXT NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'onboarding';

-- CreateIndex
CREATE INDEX "Memory_cognitiveType_idx" ON "Memory"("cognitiveType");
