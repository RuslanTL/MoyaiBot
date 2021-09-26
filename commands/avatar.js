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
                .setDescription('the user (defaults to author)')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName("resolution")
                .setDescription('resolution of image (128,256,512,1024,2048), defaults to 512')
                .setRequired(false)),        
  async execute(interaction) {
      await interaction.deferReply();
      let target = interaction.options.getUser('user');
      if(target == undefined){
          target = interaction.member.user;
      }
      let size = interaction.options.getInteger('resolution')
      if(size == undefined){
          size = 512;
      }
      const file = new MessageAttachment(target.displayAvatarURL({format : "jpg", size : size}));
      await wait(300);
      await interaction.editReply({files:[file]});
  },
};