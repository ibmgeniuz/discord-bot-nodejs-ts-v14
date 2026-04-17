import { type ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "../types/command";

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lists available slash commands (only you see this)."),
  async execute(interaction: ChatInputCommandInteraction) {
    const lines = interaction.client.commands.map((cmd) => {
      const desc = cmd.data.description || "No description.";
      return `• \`/${cmd.data.name}\` — ${desc}`;
    });
    const body = ["**Commands**", ...lines].join("\n");
    await interaction.reply({ content: body, flags: MessageFlags.Ephemeral });
  },
};

export default command;
