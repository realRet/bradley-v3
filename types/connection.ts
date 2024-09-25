import type { AudioPlayer, VoiceConnection } from "@discordjs/voice"

export type Connection = {
    player: AudioPlayer
    queue: string[]
    connection: VoiceConnection;
    isPlaying: boolean
}