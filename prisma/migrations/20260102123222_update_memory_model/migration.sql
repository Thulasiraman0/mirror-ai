/*
  Warnings:

  - You are about to drop the column `content` on the `Memory` table. All the data in the column will be lost.
  - You are about to drop the column `importance` on the `Memory` table. All the data in the column will be lost.
  - Added the required column `key` to the `Memory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Memory` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Memory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Memory" DROP COLUMN "content",
DROP COLUMN "importance",
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "value" JSONB NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Memory_profileId_idx" ON "Memory"("profileId");

-- CreateIndex
CREATE INDEX "Memory_type_idx" ON "Memory"("type");
