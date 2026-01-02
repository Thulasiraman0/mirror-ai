export type PromptMemory = {
  key: string;
  value: string;
  cognitiveType: string;
  source: string;
};

export type PromptContext = {
  identity: PromptMemory[];
  long: PromptMemory[];
  medium: PromptMemory[];
  short: PromptMemory[];
};
