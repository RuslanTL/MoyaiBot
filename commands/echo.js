const { MessageEmbed, WebhookClient } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('send a message as the bot')
        .addChannelOption(option =>
            option.setName('chan')
                .setDescription('the channel')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('content')
                .setDescription('content of message')
                .setRequired(true)),
  async execute(interaction) {
        await interaction.deferReply({ephemeral: true});
        const chan= interaction.options.getChannel('chan');
        const content = interaction.options.getString('content');
        chan.send(content)
            .catch(console.error);
        await interaction.editReply({ content: `echoed`, ephemeral: true });
  },
};