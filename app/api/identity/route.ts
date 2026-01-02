import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getOrCreateMirrorProfile } from "@/lib/identity";

export async function GET() {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getOrCreateMirrorProfile(session.user.id);

  return NextResponse.json({
    profileId: profile.id,
    userId: profile.userId,
    createdAt: profile.createdAt,
  });
}
