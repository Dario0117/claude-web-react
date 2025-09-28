/** biome-ignore-all lint/suspicious/noConsole: logging */
import type { LogContext } from '@/types/logger';

export function logWarning(ctx: LogContext) {
  console.warn(ctx.message);
}

export function logError(ctx: LogContext) {
  console.error(ctx.message);
}

export function logInfo(ctx: LogContext) {
  console.info(ctx.message);
}
