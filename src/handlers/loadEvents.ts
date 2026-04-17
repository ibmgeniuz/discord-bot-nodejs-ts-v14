import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Client, ClientEvents } from "discord.js";
import { logger } from "../utils/logger";

const EVENTS_DIR = join(import.meta.dir, "../events");

export type BotEvent<K extends keyof ClientEvents = keyof ClientEvents> = {
  name: K;
  once?: boolean;
  execute: (...args: ClientEvents[K]) => void | Promise<void>;
};

/**
 * Registers handlers from `src/events`: each file default-exports `{ name, once?, execute }`.
 */
export async function registerEvents(client: Client): Promise<void> {
  let files: string[];
  try {
    files = await readdir(EVENTS_DIR);
  } catch (e) {
    logger.error(`Cannot read events directory: ${EVENTS_DIR}`, e);
    throw e;
  }

  for (const file of files) {
    if (file.startsWith("_")) continue;
    if (!file.endsWith(".ts") && !file.endsWith(".js")) continue;

    const fileUrl = pathToFileURL(join(EVENTS_DIR, file)).href;
    try {
      const mod = (await import(fileUrl)) as { default?: BotEvent };
      const event = mod.default;
      if (!event?.name || typeof event.execute !== "function") {
        logger.warn(`Skipping "${file}": expected default export { name, execute }`);
        continue;
      }

      const run = event.execute as (...args: unknown[]) => void | Promise<void>;
      const runner = (...args: unknown[]) => {
        void Promise.resolve(run(...args)).catch((err: unknown) => {
          logger.error(`Event "${String(event.name)}" handler failed`, err);
        });
      };

      if (event.once) {
        client.once(event.name, runner as never);
      } else {
        client.on(event.name, runner as never);
      }
      logger.debug(`Registered event ${String(event.name)}`, { file, once: Boolean(event.once) });
    } catch (e) {
      logger.error(`Failed to load event module ${file}`, e);
      throw e;
    }
  }
}
