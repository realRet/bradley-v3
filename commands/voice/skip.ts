import { CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { Connections } from ".";
import type { Command } from "../../types/command";

export const skip: Command = {
    name: "skip",
    description: "Skips the current song",
    execute: execute,
    cmd: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song"),
}

async function execute(interaction: CommandInteraction) {
    const voiceChannel = (interaction.member as GuildMember)?.voice?.channel;
    if(!voiceChannel) {
        await interaction.reply("You need to be in a voice channel to use this command.");
        return;
    }
    
    const connection = Connections.get(voiceChannel.id ?? "");
    if(!connection) {
        await interaction.reply("I can't skip any music");
        return;
    }    
    connection?.player.stop(true);
    await interaction.reply("Skipped the current song");
}