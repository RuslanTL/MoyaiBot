const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('sends a list of commands'),
  async execute(interaction) {
      
  },
};