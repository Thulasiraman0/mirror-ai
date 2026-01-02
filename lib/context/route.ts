import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getRankedMemories } from "@/lib/memory/retrieval";
import { selectAndSliceMemories } from "@/lib/context";

export async function GET() {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const memories = await getRankedMemories(session.user.id);
  const windowed = selectAndSliceMemories(memories);

  return NextResponse.json({
    counts: {
      identity: windowed.identity.length,
      long: windowed.long.length,
      medium: windowed.medium.length,
      short: windowed.short.length,
    },
    windows: windowed,
  });
}
