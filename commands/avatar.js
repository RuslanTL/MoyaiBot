const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const jimp = require('jimp');
const wait = require('util').promisify(setTimeout);        
const fspromises = require("fs/promises")
const fs = require("fs");
module.exports = {
  data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('get avatar of user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('the user')
                .setRequired(true)
        ),
  async execute(interaction) {
      await interaction.deferReply();
      const target = interaction.options.getUser('user');
      const file = new MessageAttachment(target.displayAvatarURL({format : "jpg", size : 512}));
      await wait(300);
      await interaction.editReply({files:[file]});
  },
};