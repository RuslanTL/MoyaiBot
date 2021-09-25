const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const jimp = require('jimp');
const wait = require('util').promisify(setTimeout);        
const fspromises = require("fs/promises")
const fs = require("fs");
module.exports = {
  data: new SlashCommandBuilder()
        .setName('jpeg')
        .setDescription('jpegify')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('The link to the image')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('quality')
                .setDescription("quality of jpeg")
                .setRequired(true)
            ),
  async execute(interaction) {
    await interaction.deferReply();
    const source = interaction.options.getString('link');
    const quality= interaction.options.getInteger('quality');
    await jimp.read(source)
    .then(source => {
        return source
        .quality(quality)
        .write('jpegresult.jpg')
    })
    const file = await new MessageAttachment('./jpegresult.jpg');

    await wait(300);
    await interaction.editReply({files:[file]});
  },
};