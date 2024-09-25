import { SlashCommandBuilder, type CommandInteraction } from "discord.js";
import type { Command } from "../types/command";

export const ping: Command = {
    name: "ping",
    description: "Pings the bot",
    execute: execute,
    cmd: new SlashCommandBuilder().setName("ping").setDescription("Pings the bot"),
}

async function execute(interaction: CommandInteraction) {
    await interaction.reply("Pong!");
}

