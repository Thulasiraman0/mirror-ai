import { PromptContext } from "./types"

type WindowLimits = {
  identity: number
  long: number
  medium: number
  short: number
}

const DEFAULT_LIMITS: WindowLimits = {
  identity: 20,
  long: 10,
  medium: 8,
  short: 5,
}

export function serializeContext(
  windows: PromptContext,
  limits: Partial<WindowLimits> = {}
): PromptContext {
  const finalLimits = { ...DEFAULT_LIMITS, ...limits }

  return {
    identity: windows.identity.slice(0, finalLimits.identity),
    long: windows.long.slice(0, finalLimits.long),
    medium: windows.medium.slice(0, finalLimits.medium),
    short: windows.short.slice(0, finalLimits.short),
  }
}
