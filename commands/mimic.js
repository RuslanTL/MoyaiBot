
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
        interaction.deferReply({ephemeral: true});
        const target = interaction.options.getUser('user');
        const chan= interaction.options.getChannel('chan');
        const content = interaction.options.getString('content');
        await chan.createWebhook('mimic_hook', {
            avatar: 'https://cdn.discordapp.com/attachments/660942732788891658/889879382477393940/image0.jpg',
        })
            .then(webhook => console.log(`Created webhook ${webhook}`))
            .catch(console.error);
        try {
            const webhooks = await chan.fetchWebhooks();
            const webhook = await webhooks.find(hook => hook.name = 'mimic_hook')
            console.log(webhook);
            await webhook.send({
                content: content,
                username: target.username,
                avatarURL: target.avatarURL(),
            });
            webhook.delete('delete');

        } catch (error) {
            console.error('lol error: ', error);
        }
        await interaction.editReply({ content: `mimicked!`, ephemeral: true });
  },
};