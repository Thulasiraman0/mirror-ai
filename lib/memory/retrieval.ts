import { prisma } from "@/lib/db";
import { CognitiveType } from "@/lib/memoryTypes";

type RetrievalOptions = {
  profileId: string;
  query?: string;
  cognitiveTypes?: CognitiveType[];
  limit?: number;
};

export async function getRelevantMemories({
  profileId,
  query,
  cognitiveTypes,
  limit = 10,
}: RetrievalOptions) {
  const memories = await prisma.memory.findMany({
    where: {
      profileId,
      status: "ACTIVE",
      ...(cognitiveTypes && {
        cognitiveType: { in: cognitiveTypes },
      }),
    },
  });

  const scored = memories.map((m) => {
    let score = 0;

    // Core intelligence signals
    score += m.weight * 0.4;
    score += m.confidence * 0.3;
    score += m.score * 0.3;

    // Recency boost
    const ageHours =
      (Date.now() - new Date(m.lastAccessed).getTime()) / 36e5;
    score += Math.max(0, 1 - ageHours / 72);

    // Simple keyword relevance (pre-AI)
    if (query && m.value.toLowerCase().includes(query.toLowerCase())) {
      score += 0.5;
    }

    return { ...m, finalScore: score };
  });

  if (scored.length === 0) {
    console.warn("[Memory] No memories found for profile:", profileId);
  }

  return scored
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, limit);
}
