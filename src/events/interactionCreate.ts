import { Events, type Interaction } from "discord.js";
import { handleChatInputCommand } from "../handlers/handleInteraction";
import type { BotEvent } from "../handlers/loadEvents";

const event: BotEvent<typeof Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    await handleChatInputCommand(interaction);
  },
};

export default event;
