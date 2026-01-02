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

export async function getProfileByUserId(userId: string) {
  const profile = await prisma.mirrorProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
}
