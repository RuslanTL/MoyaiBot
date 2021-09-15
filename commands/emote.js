const { Client, Intents, Collection, Permissions } = require('discord.js');
const client = new Client({
    intents:	[Intents.FLAGS.GUILD_VOICE_STATES] 
});

const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
        .setName('emote')
        .setDescription('create an emote')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('The link to the image')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('name')
                .setDescription('the name of the emote')
                .setRequired(true)),
  async execute(interaction) {
        const guild = interaction.member.guild;
        const member = interaction.member
        const link = interaction.options.getString('link');
        const name = interaction.options.getString('name');
        if(member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)){
            guild.emojis.create(link, name)
                    .then(emoji => {
                        console.log(`Created new emoji with name ${emoji.name}!`)
                    })
                    .catch(console.error);
            await interaction.reply(`created new emoji with name ${name}!`)
        } else{
            await interaction.reply(`you lack the permissions to create an emote`)
        }

  },
};