const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ping'),
  async execute(interaction) {
      interaction.reply('Pong!');
  },
};