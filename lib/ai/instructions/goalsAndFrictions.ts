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

export function buildGoalAndFrictionInstructions(
  context: PromptContext
): Instruction[] {
  const instructions: Instruction[] = [];

  context.long.forEach((mem) => {
    instructions.push({
      level: InstructionLevel.GOALS,
      content: `Current goal: ${mem.value}`,
    });
  });

  context.medium.forEach((mem) => {
    instructions.push({
      level: InstructionLevel.FRICTIONS,
      content: `Current challenge: ${mem.value}`,
    });
  });

  return instructions;
}
