import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getAllCognitiveMemory } from "@/lib/memoryQuery";
import { getOrCreateMirrorProfile } from "@/lib/identity";
import { computeMemoryScore } from "@/lib/memoryScoring";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getOrCreateMirrorProfile(session.user.id);
  const memories = await getAllCognitiveMemory(profile.id);

  const ranked = memories
    .map((m) => ({
      ...m,
      score: computeMemoryScore(m),
    }))
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({ memories: ranked });
}
