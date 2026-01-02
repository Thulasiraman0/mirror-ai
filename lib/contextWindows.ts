import { CognitiveType } from "./memoryTypes";

export enum ContextWindow {
  IDENTITY = "identity",   // Never expires
  LONG = "long",           // Goals, values
  MEDIUM = "medium",       // Ongoing challenges
  SHORT = "short",         // Recent state
}

export const CognitiveWindowMap: Record<CognitiveType, ContextWindow> = {
  GOAL_LONG_TERM: ContextWindow.IDENTITY,
  GOAL_SHORT_TERM: ContextWindow.LONG,

  FRICTION_ACTIVE: ContextWindow.MEDIUM,
  FRICTION_RECURRING: ContextWindow.MEDIUM,

  PREFERENCE_COMMUNICATION: ContextWindow.IDENTITY,
  PREFERENCE_ROUTINE: ContextWindow.LONG,

  IDENTITY_CORE: ContextWindow.IDENTITY,
  VALUE_SYSTEM: ContextWindow.IDENTITY,
};
