import { Instruction, InstructionLevel } from "./types";
import { SYSTEM_INSTRUCTION } from "./system";
import { buildMemoryInstructions } from "./fromMemory";
import { buildGoalAndFrictionInstructions } from "./goalsAndFrictions";
import { buildPreferenceInstructions } from "./preferences";

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

export function assembleInstructions(
  context: PromptContext,
  userTask: string
): Instruction[] {
  return [
    SYSTEM_INSTRUCTION,
    ...buildMemoryInstructions(context),
    ...buildGoalAndFrictionInstructions(context),
    ...buildPreferenceInstructions(context),
    {
      level: InstructionLevel.TASK,
      content: userTask,
    },
  ].filter(Boolean) as Instruction[];
}

