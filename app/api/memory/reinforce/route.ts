import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { reinforceMemory } from "@/lib/memoryReinforcement";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { memoryId } = await req.json();

  if (!memoryId) {
    return NextResponse.json(
      { error: "memoryId required" },
      { status: 400 }
    );
  }

  const updated = await reinforceMemory(memoryId);

  return NextResponse.json({ success: true, memory: updated });
}
