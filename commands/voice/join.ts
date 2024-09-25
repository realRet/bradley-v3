import { CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../types/command";
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from "@discordjs/voice";
import { Connections } from ".";


export const join: Command = {
    name: "join",
    description: "Joins a voice channel",
    execute: execute,
    cmd: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Joins a voice channel"),
}

async function execute(interaction: CommandInteraction, reply: boolean = true) {

    const voiceChannel = (interaction.member as GuildMember)?.voice?.channel;
    if(!voiceChannel) {
        await interaction.reply("You need to be in a voice channel to use this command.");
        return;
    }

    if(!voiceChannel.joinable && interaction.guildId != null) {
        await interaction.reply("I can't join that voice channel.");
        return;
    }

    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
    })

    if(!connection) {
        await interaction.reply("Could not join voice channel.");
        return;
    }

    Connections.set(voiceChannel.id, {
        player: createAudioPlayer(), 
        queue: [],
        connection: connection,
        isPlaying: false
    });

    if(reply)
        await interaction.reply("Joined!");
}