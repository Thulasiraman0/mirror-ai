import { Instruction, InstructionLevel } from "./types";

type PromptMemory = {
  key: string;
  value: string;
  cognitiveType: string;
  source: string;
};

type PromptContext = {
  identity: PromptMemory[];
  long: PromptMemory[];
  medium: PromptMemory[];
  short: PromptMemory[];
};

export function buildPreferenceInstructions(
  context: PromptContext
): Instruction[] {
  return context.identity
    .filter((mem) => mem.cognitiveType.startsWith("PREFERENCE"))
    .map((mem) => ({
      level: InstructionLevel.PREFERENCES,
      content: `Preferred interaction style: ${mem.value}`,
    }));
}
