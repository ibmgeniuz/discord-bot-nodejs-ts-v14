import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { logger } from "../utils/logger";

/**
 * Runs a slash command handler with consistent error replies and logging.
 */
export async function handleChatInputCommand(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`No handler for /${interaction.commandName}`);
    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: "Unknown command.",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "Unknown command.",
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (e) {
      logger.error("Failed to send unknown-command reply", e);
    }
    return;
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    logger.error(`Error executing /${interaction.commandName}`, err);

    const message = "Something went wrong while running this command.";
    const ephemeralReply = {
      content: message,
      flags: MessageFlags.Ephemeral,
    } as const;

    try {
      if (interaction.deferred) {
        // editReply does not accept Ephemeral (visibility was set on defer/reply).
        await interaction.editReply({ content: message });
      } else if (interaction.replied) {
        await interaction.followUp(ephemeralReply);
      } else {
        await interaction.reply(ephemeralReply);
      }
    } catch (replyErr) {
      logger.error("Failed to send error reply to user", replyErr);
    }
  }
}
