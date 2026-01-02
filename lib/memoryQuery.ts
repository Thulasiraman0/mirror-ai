import { prisma } from "@/lib/db";
import { CognitiveTypes, type CognitiveType } from "@/lib/memoryTypes";

export async function getMemoriesByType(
  profileId: string,
  cognitiveType: CognitiveType
) {
  return prisma.memory.findMany({
    where: {
      profileId,
      cognitiveType,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAllCognitiveMemory(profileId: string) {
  return prisma.memory.findMany({
    where: { profileId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMemoriesBySource(profileId: string, source: string) {
  return prisma.memory.findMany({
    where: {
      profileId,
      source,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getMemoryByKey(profileId: string, key: string) {
  return prisma.memory.findFirst({
    where: {
      profileId,
      key,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
