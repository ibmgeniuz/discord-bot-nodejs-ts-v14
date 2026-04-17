import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { Collection } from "discord.js";
import type { BotCommand } from "../types/command";
import { logger } from "../utils/logger";

const COMMANDS_DIR = join(import.meta.dir, "../commands");

/**
 * Loads every `*.ts` / `*.js` module in `src/commands` that default-exports a {@link BotCommand}.
 * Files prefixed with `_` are skipped (handy for shared builders or tests).
 */
export async function loadCommands(): Promise<Collection<string, BotCommand>> {
  const collection = new Collection<string, BotCommand>();
  let files: string[];
  try {
    files = await readdir(COMMANDS_DIR);
  } catch (e) {
    logger.error(`Cannot read commands directory: ${COMMANDS_DIR}`, e);
    throw e;
  }

  for (const file of files) {
    if (file.startsWith("_")) continue;
    if (!file.endsWith(".ts") && !file.endsWith(".js")) continue;

    const fileUrl = pathToFileURL(join(COMMANDS_DIR, file)).href;
    try {
      const mod = (await import(fileUrl)) as { default?: BotCommand };
      const command = mod.default;
      if (!command?.data || typeof command.execute !== "function") {
        logger.warn(`Skipping "${file}": expected default export {{ data, execute }}`);
        continue;
      }
      const name = command.data.name;
      if (collection.has(name)) {
        logger.warn(`Duplicate command name "${name}" in ${file}; keeping first`);
        continue;
      }
      collection.set(name, command);
      logger.debug(`Loaded command /${name}`, { file });
    } catch (e) {
      logger.error(`Failed to load command module ${file}`, e);
      throw e;
    }
  }

  return collection;
}

/** JSON bodies for `REST.put` — same source of truth as the running bot. */
export async function getSlashCommandRegistrationBodies() {
  const commands = await loadCommands();
  return [...commands.values()].map((c) => c.data.toJSON());
}
