import { CognitiveTypes, type CognitiveType } from "@/lib/memoryTypes";

export const DEFAULT_MEMORY_WEIGHTS: Record<CognitiveType, number> = {
  [CognitiveTypes.GOAL_LONG_TERM]: 1.0,
  [CognitiveTypes.GOAL_SHORT_TERM]: 0.8,

  [CognitiveTypes.FRICTION_ACTIVE]: 0.9,
  [CognitiveTypes.FRICTION_RECURRING]: 0.85,

  [CognitiveTypes.PREFERENCE_COMMUNICATION]: 0.6,
  [CognitiveTypes.PREFERENCE_ROUTINE]: 0.7,

  [CognitiveTypes.IDENTITY_CORE]: 1.0,
  [CognitiveTypes.VALUE_SYSTEM]: 0.95,
};

export function getDefaultWeight(cognitiveType: CognitiveType): number {
  return DEFAULT_MEMORY_WEIGHTS[cognitiveType] ?? 0.5;
}
