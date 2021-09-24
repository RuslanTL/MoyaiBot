
const { MessageEmbed, WebhookClient } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
        .setName('mimic')
        .setDescription('send a message as another user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('chan')
                .setDescription('the channel')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('content')
                .setDescription('content of message')
                .setRequired(true)),
  async execute(interaction) {
        const target = interaction.options.getUser('user');
        const chan= interaction.options.getChannel('chan');
        const content = interaction.options.getString('content');
        try {
            const webhooks = await chan.fetchWebhooks();
            const webhook = webhooks.first();
            await webhook.send({
                content: content,
                username: target.username,
                avatarURL: target.avatarURL(),
            });
        } catch (error) {
            console.error('lol error: ', error);
        }
  },
};