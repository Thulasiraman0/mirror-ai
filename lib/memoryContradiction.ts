import { prisma } from "@/lib/db";

export async function resolveContradiction(
  profileId: string,
  key: string,
  newConfidence: number
) {
  const existing = await prisma.memory.findFirst({
    where: {
      profileId,
      key,
      status: "ACTIVE",
    },
  });

  if (!existing) return null;

  if (newConfidence >= existing.confidence) {
    await prisma.memory.update({
      where: { id: existing.id },
      data: { status: "ARCHIVED" },
    });

    return "ARCHIVED_OLD";
  }

  return "REJECTED_NEW";
}
