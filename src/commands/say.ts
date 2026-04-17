import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "../types/command";

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Echoes your message in this channel.")
    .addStringOption((option) =>
      option.setName("message").setDescription("Text to send").setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const text = interaction.options.getString("message", true);
    await interaction.reply(text);
  },
};

export default command;
