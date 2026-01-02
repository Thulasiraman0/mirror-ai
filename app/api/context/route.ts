import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getProfileByUserId } from "@/lib/identity";
import { getRelevantMemories } from "@/lib/memory/retrieval";

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfileByUserId(session.user.id);

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? undefined;

  const memories = await getRelevantMemories({
    profileId: profile.id,
    query,
  });

  return NextResponse.json({
    profileId: profile.id,
    context: memories.map((m) => ({
      key: m.key,
      value: m.value,
      cognitiveType: m.cognitiveType,
      score: m.finalScore,
      source: m.source,
    })),
  });
}
