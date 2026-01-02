import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getProfileByUserId } from "@/lib/identity";
import { getRelevantMemories } from "@/lib/memory/retrieval";
import { selectAndSliceMemories } from "@/lib/context";
import { buildPromptContext } from "@/lib/ai/prompts";
import { assembleInstructions } from "@/lib/ai/instructions/assemble";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getProfileByUserId(session.user.id);

    const memories = await getRelevantMemories({
      profileId: profile.id,
    });

    const windows = selectAndSliceMemories(memories);
    const context = buildPromptContext(windows);

    const instructions = assembleInstructions(
      context,
      "Help me plan my week productively."
    );

    return NextResponse.json(instructions);
  } catch (error) {
    console.error("[Instructions API Error]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}
