import { Client, Events, GatewayIntentBits, REST, Routes,  } from 'discord.js';
import { ping } from './commands/ping';
import type { Command } from './types/command';
import { join } from './commands/voice/join';
import { play } from './commands/voice/play';
import { skip } from './commands/voice/skip';

export const commands: Command[] = [ping, join, play, skip]


const token = Bun.env.DISCORD_TOKEN;
const applicationId = Bun.env.DISCORD_APPLICATION_ID;


if (!token || !applicationId) {
    console.error("DISCORD_TOKEN or DISCORD_APPLICATION_ID is not set");
    process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });
const rest = new REST().setToken(token);

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

try {
    await rest.put(
        Routes.applicationCommands(applicationId),
        {body: commands.map((command) => command.cmd.toJSON())}
    )
}catch (e) {
    throw new Error(`Failed to register commands: ${e}`,);
}


client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = commands.find(cmd => cmd.name === interaction.commandName);
    if (!command) return;

    await command.execute(interaction);
});


client.login(token);