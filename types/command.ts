import type { CommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";

export type Command = {
    name: string;
    description: string;
    execute: (interaction: CommandInteraction) => Promise<void>;
    cmd: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
}