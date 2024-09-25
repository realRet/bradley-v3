import { CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../types/command";
import { Connections } from ".";
import { join } from "./join";
import { createAudioResource } from "@discordjs/voice";
import ytdl from "@distube/ytdl-core";

export const play: Command = {
    name: "play",
    description: "Play a song in a voice channel",
    execute: execute,
    cmd: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song in a voice channel")
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Search the internet for your song')
                .setRequired(true)
            ),
}

async function execute(interaction: CommandInteraction) {

    const voiceChannel = (interaction.member as GuildMember)?.voice?.channel;
    if(!voiceChannel) {
        await interaction.reply("You need to be in a voice channel to use this command.");
        return;
    }

    let connection = Connections.get(voiceChannel.id ?? "");
    
    if(!connection) {
        //@ts-ignore ik ben lui geen zin om dingen los te trekken
        await join.execute(interaction, false);
        connection = Connections.get(voiceChannel.id ?? "");
    }
    
    if(!connection) {
        await interaction.reply("I can't play any music");
        return;
    }

    const query = interaction.options.get("query")?.value?.toString();
    if(!query) {
        await interaction.reply("You need to provide a query to play");
        return;
    }

    connection?.queue.push(query);

    if(connection?.isPlaying) {
        await interaction.reply("I'm already playing music, I'll add your query to the queue");
        return;
    }

    const subscription = connection.connection.subscribe(connection.player);
    if(!subscription) {
        await interaction.reply("I can't play any music");
        return;
    }

    await interaction.reply("Searching for your song...");

    while(connection?.queue.length > 0) {
            connection.isPlaying = true;
            const songUrl = connection.queue.shift() ?? "";
            
            if (!ytdl.validateURL(songUrl)) {
                await interaction.followUp(`Invalid YouTube URL: ${songUrl}`);
                continue; // Skip to the next item in the queue
            }
            
            const song = ytdl(songUrl, { filter: 'audioonly' });
            const songInfo = await ytdl.getInfo(songUrl);
            await interaction.followUp("Playing: " + songInfo.videoDetails.title);
            connection.player.play(createAudioResource(song));
            await new Promise(resolve => connection.player.once('idle', resolve));
    }

    await interaction.followUp("No more songs in the queue.... BYE!");
    subscription.unsubscribe()
    connection.connection.disconnect();
    Connections.delete(voiceChannel.id ?? "");
}

