import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CognitiveTypes, type CognitiveType } from "@/lib/memoryTypes";
import { getDefaultWeight } from "@/lib/memoryWeights";

// Map onboarding keys to their cognitive types
const cognitiveTypeMap: Record<string, CognitiveType> = {
  primary_goal: CognitiveTypes.GOAL_LONG_TERM,
  current_challenge: CognitiveTypes.FRICTION_ACTIVE,
  preferred_feedback_style: CognitiveTypes.PREFERENCE_COMMUNICATION,
};

export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const profile = await prisma.mirrorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const memories = Object.entries(body).map(([key, value]) => {
    const cognitiveType = cognitiveTypeMap[key] || CognitiveTypes.IDENTITY_CORE;
    return {
      profileId: profile.id,
      key,
      value,
      cognitiveType,
      source: "onboarding",
      weight: getDefaultWeight(cognitiveType),
      confidence: 1.0,
    };
  });

  await prisma.memory.createMany({
    data: memories,
  });

  return NextResponse.json({ success: true });
}
