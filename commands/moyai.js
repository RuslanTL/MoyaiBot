const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const jimp = require('jimp');
const wait = require('util').promisify(setTimeout);        
const fspromises = require("fs/promises")
const fs = require("fs");
const { add } = require('libsodium-wrappers');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('moyai')
    .setDescription('moyaify your profile picture!')
    .addStringOption(option =>
        option.setName('style')
            .setDescription('choose the style you want (overlay, circle)')
            .setRequired(false))
    .addUserOption(option =>
        option.setName('user')
            .setDescription('choose the user (uses author if unspecified)')
            .setRequired(false)
        )
    .addStringOption(option =>
        option.setName('link')
            .setDescription('the link to the source image (chooses avatar URL if unspecified)')
            .setRequired(false)
    ),
    async execute(interaction) {
        await interaction.deferReply();
        const style = await interaction.options.getString('style');
        const target = await interaction.options.getUser('user');
        const link = await interaction.options.getString('link');
        let source;
        if(link == undefined){
            if(target == undefined){
                source = await interaction.member.user.displayAvatarURL({format : "jpg", size : 1024});
            }
            else source = await target.displayAvatarURL({format : "jpg", size : 1024});
        } else{
            source = link;
        }
        let moyai;
        if(style == "overlay"){
            moyai = await fs.readFileSync('./moyai_overlay.png')
        } else if(style == "circle"){
            moyai = await fs.readFileSync('./moyai_overlay2.png')
        } else{
            moyai = await fs.readFileSync('./moyai_overlay.png')
        }
        await jimp.read(source)
        .then(source => {
            jimp.read(moyai)
            .then(moyai =>{
                source.resize(1000,1000)
                return moyai
                .resize(1000,1000)
                .composite(source, 1, 0, {
                    mode: jimp.BLEND_DESTINATION_OVER,
                    opacitySource: 1,
                    opacityDest: 1
                })
                .write('moyairesult.png')
            })
            return source
        })
        const file = await new MessageAttachment('./moyairesult.png');

        await wait(300);
        await interaction.editReply({files:[file]});
    },
};