export enum InstructionLevel {
  SYSTEM = "system",
  IDENTITY = "identity",
  VALUES = "values",
  GOALS = "goals",
  FRICTIONS = "frictions",
  PREFERENCES = "preferences",
  TASK = "task",
}

export type Instruction = {
  level: InstructionLevel;
  content: string;
};
