import "dotenv/config";
import { REST, Routes } from "discord.js";
import { getSlashCommandRegistrationBodies } from "../src/handlers/loadCommands";
import { logger } from "../src/utils/logger";

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID?.trim();

if (!token || !clientId) {
  logger.error("Missing BOT_TOKEN or CLIENT_ID (see .env.example).");
  process.exit(1);
}

const resolvedToken = token;
const resolvedClientId = clientId;

const rest = new REST().setToken(resolvedToken);

async function main(): Promise<void> {
  const body = await getSlashCommandRegistrationBodies();
  logger.info(`Registering ${body.length} application (/) commands…`);

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(resolvedClientId, guildId), { body });
    logger.info(`Guild commands updated for guild ${guildId} (instant in this server).`);
  } else {
    await rest.put(Routes.applicationCommands(resolvedClientId), { body });
    logger.info("Global commands updated (may take up to ~1 hour to appear everywhere).");
  }
}

main().catch((err: unknown) => {
  logger.error("deploy-commands failed", err);
  process.exit(1);
});
