import { type Client, Events } from "discord.js";
import type { BotEvent } from "../handlers/loadEvents";
import { logger } from "../utils/logger";

const event: BotEvent<typeof Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client<true>) {
    logger.info(`Ready — logged in as ${client.user.tag} (${client.user.id})`);
  },
};

export default event;
