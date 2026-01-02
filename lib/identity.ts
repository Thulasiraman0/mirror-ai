import { prisma } from "@/lib/db";

export async function getOrCreateMirrorProfile(userId: string) {
  const existing = await prisma.mirrorProfile.findUnique({
    where: { userId },
  });

  if (existing) return existing;

  return prisma.mirrorProfile.create({
    data: {
      userId,
    },
  });
}
