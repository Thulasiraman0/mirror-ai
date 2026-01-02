import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getAllCognitiveMemory } from "@/lib/memoryQuery";
import { getOrCreateMirrorProfile } from "@/lib/identity";
import { MIN_DECAY_FACTOR, DECAY_PER_DAY } from "@/lib/memoryRules";

function applyDecay(memory: any) {
  if (!memory.lastAccessed) return { ...memory, score: memory.weight * memory.confidence };

  const days =
    (Date.now() - new Date(memory.lastAccessed).getTime()) /
    (1000 * 60 * 60 * 24);

  const decayFactor = Math.max(
    MIN_DECAY_FACTOR,
    1 - days * DECAY_PER_DAY
  );

  return {
    ...memory,
    score: memory.weight * memory.confidence * decayFactor,
  };
}

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getOrCreateMirrorProfile(session.user.id);
  const rawMemories = await getAllCognitiveMemory(profile.id);

  const memories = rawMemories
    .map(applyDecay)
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({ memories });
}
