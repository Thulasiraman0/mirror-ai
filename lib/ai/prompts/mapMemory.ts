import { PromptMemory } from "./types";

type MemoryInput = {
  key: string;
  value: unknown;
  cognitiveType: string;
  source: string;
};

export function mapMemoryToPrompt(memory: MemoryInput): PromptMemory {
  return {
    key: memory.key,
    value: typeof memory.value === "string" ? memory.value : JSON.stringify(memory.value),
    cognitiveType: memory.cognitiveType,
    source: memory.source,
  };
}
