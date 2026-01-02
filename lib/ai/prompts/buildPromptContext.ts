import { serializeContext } from "./serializeContext";
import { mapMemoryToPrompt } from "./mapMemory";

export function buildPromptContext(windows: Record<string, unknown[]>) {
  const mapped = {
    identity: (windows.identity || []).map(mapMemoryToPrompt),
    long: (windows.long || []).map(mapMemoryToPrompt),
    medium: (windows.medium || []).map(mapMemoryToPrompt),
    short: (windows.short || []).map(mapMemoryToPrompt),
  };

  return serializeContext(mapped);
}
