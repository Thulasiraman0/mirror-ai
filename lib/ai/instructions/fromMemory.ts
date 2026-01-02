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

export function buildMemoryInstructions(
  context: PromptContext
): Instruction[] {
  const instructions: Instruction[] = [];

  context.identity.forEach((mem) => {
    if (!mem.cognitiveType.startsWith("PREFERENCE")) {
      instructions.push({
        level: InstructionLevel.IDENTITY,
        content: `User identity: ${mem.value}`,
      });
    }
  });

  return instructions;
}
