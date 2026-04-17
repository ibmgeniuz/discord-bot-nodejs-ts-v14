/** Minimal ANSI colors — no extra dependencies. */
const c = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
} as const;

function stamp(): string {
  return new Date().toISOString();
}

function format(level: string, color: string, message: string, extra?: unknown): string {
  const base = `${c.dim}${stamp()}${c.reset} ${color}[${level}]${c.reset} ${message}`;
  if (extra !== undefined) {
    return `${base} ${c.gray}${typeof extra === "string" ? extra : JSON.stringify(extra)}${c.reset}`;
  }
  return base;
}

export const logger = {
  info(message: string, extra?: unknown): void {
    console.log(format("INFO", c.blue, message, extra));
  },
  warn(message: string, extra?: unknown): void {
    console.warn(format("WARN", c.yellow, message, extra));
  },
  error(message: string, extra?: unknown): void {
    console.error(format("ERROR", c.red, message, extra));
    if (extra instanceof Error) {
      console.error(c.gray, extra.stack ?? extra.message, c.reset);
    }
  },
  debug(message: string, extra?: unknown): void {
    if (process.env.DEBUG === "1") {
      console.log(format("DEBUG", c.green, message, extra));
    }
  },
};
