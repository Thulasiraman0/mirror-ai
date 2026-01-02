import { prisma } from "@/lib/db";
import { REINFORCEMENT_STEP, MAX_SCORE } from "./memoryRules";

export async function reinforceMemory(memoryId: string) {
  const memory = await prisma.memory.findUnique({
    where: { id: memoryId },
  });

  if (!memory) throw new Error("Memory not found");

  return prisma.memory.update({
    where: { id: memoryId },
    data: {
      confidence: Math.min(MAX_SCORE, memory.confidence + REINFORCEMENT_STEP),
      weight: Math.min(MAX_SCORE, memory.weight + REINFORCEMENT_STEP),
      lastAccessed: new Date(),
    },
  });
}
