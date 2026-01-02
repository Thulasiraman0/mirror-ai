import { ContextWindow, CognitiveWindowMap } from "./windows";
import { WINDOW_LIMITS } from "./limits";
import { CognitiveType } from "@/lib/memoryTypes";

type MemoryWithScore = {
  id: string;
  key: string;
  value: unknown;
  cognitiveType: string;
  source: string;
  weight: number;
  confidence: number;
  score?: number;
  finalScore: number;
  lastAccessed: Date;
  status: string;
  profileId: string;
  createdAt: Date;
};

type WindowedMemories = Record<ContextWindow, MemoryWithScore[]>;

export function selectAndSliceMemories(
  memories: MemoryWithScore[]
): WindowedMemories {
  const grouped: WindowedMemories = {
    identity: [],
    long: [],
    medium: [],
    short: [],
  };

  for (const memory of memories) {
    const cogType = memory.cognitiveType as CognitiveType;
    const window = CognitiveWindowMap[cogType];
    if (!window) continue;

    grouped[window].push(memory);
  }

  // Sort by relevance score (finalScore from retrieval)
  for (const window in grouped) {
    grouped[window as ContextWindow] = grouped[
      window as ContextWindow
    ]
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, WINDOW_LIMITS[window as ContextWindow]);
  }

  return grouped;
}
