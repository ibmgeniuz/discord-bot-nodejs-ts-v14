import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { loadCommands } from "./handlers/loadCommands";
import { registerEvents } from "./handlers/loadEvents";
import { logger } from "./utils/logger";

const token = process.env.BOT_TOKEN;
if (!token) {
  logger.error("Set BOT_TOKEN in .env (see .env.example).");
  process.exit(1);
}

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled promise rejection", reason);
});
process.on("uncaughtException", (err: unknown) => {
  logger.error("Uncaught exception", err);
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

try {
  client.commands = await loadCommands();
  await registerEvents(client);
} catch {
  process.exit(1);
}

await client.login(token);
