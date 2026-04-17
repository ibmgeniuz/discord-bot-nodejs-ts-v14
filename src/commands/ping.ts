import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "../types/command";

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong and shows WebSocket latency."),
  async execute(interaction: ChatInputCommandInteraction) {
    const ms = interaction.client.ws.ping;
    await interaction.reply(`Pong! Latency: **${ms}** ms`);
  },
};

export default command;
