// Error reporting utility for Simply Innovative Consulting

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("Application error:", error, context);
}
