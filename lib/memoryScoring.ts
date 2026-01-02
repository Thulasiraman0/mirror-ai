export function computeMemoryScore(memory: {
  weight: number;
  confidence: number;
  lastAccessed: Date;
}) {
  const daysSinceAccess =
    (Date.now() - new Date(memory.lastAccessed).getTime()) /
    (1000 * 60 * 60 * 24);

  const decayFactor = Math.exp(-0.05 * daysSinceAccess);
  const score = memory.weight * memory.confidence * decayFactor;

  // Temporary logging for validation
  console.log({
    weight: memory.weight,
    confidence: memory.confidence,
    lastAccessed: memory.lastAccessed,
    daysSinceAccess: daysSinceAccess.toFixed(2),
    decayFactor: decayFactor.toFixed(4),
    score: score.toFixed(4),
  });

  return score;
}

export function sortMemoriesByScore<
  T extends { weight: number; confidence: number; lastAccessed: Date }
>(memories: T[]): T[] {
  return [...memories].sort(
    (a, b) => computeMemoryScore(b) - computeMemoryScore(a)
  );
}

export function getTopMemories<
  T extends { weight: number; confidence: number; lastAccessed: Date }
>(memories: T[], limit: number): T[] {
  return sortMemoriesByScore(memories).slice(0, limit);
}
