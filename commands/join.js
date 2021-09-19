const path = require('path');
const {
    AudioPlayerStatus,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
} = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { generateDependencyReport } = require('@discordjs/voice');


const { Client, Intents, Collection } = require('discord.js');
const client = new Client({
    intents:	[Intents.FLAGS.GUILD_VOICE_STATES,Intents.FLAGS.GUILDS] 
});

module.exports = {
  data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('join voice channel'),
  async execute(interaction) {
        console.log(generateDependencyReport());
        const voiceChannel = interaction.member.voice.channel;
        const guild = interaction.member.guild;
        const connection = joinVoiceChannel({ 
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });
        const resource = createAudioResource(path.resolve('commands/audiotest/resonance.mp3'));
        const player = createAudioPlayer();
        connection.subscribe(player);
        player.play(resource);
        interaction.reply("joined!")
        console.log(player);
        player.on(AudioPlayerStatus.Idle, () => connection.destroy());
    }
};
