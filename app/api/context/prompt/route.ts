import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getProfileByUserId } from "@/lib/identity";
import { getRelevantMemories } from "@/lib/memory/retrieval";
import { selectAndSliceMemories } from "@/lib/context";
import { buildPromptContext } from "@/lib/ai/prompts";

export async function GET() {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfileByUserId(session.user.id);

  const memories = await getRelevantMemories({
    profileId: profile.id,
  });

  const windows = selectAndSliceMemories(memories);
  const promptContext = buildPromptContext(windows);

  return NextResponse.json(promptContext);
}
