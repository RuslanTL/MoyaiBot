

const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);        
const fs = require("fs")
const Discord = require('discord.js');
const files = fs.readdirSync('commands/albums')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rec')
        .setDescription('recommends a random album'),
    async execute(interaction) {


        let chosen = files[Math.floor(Math.random() * files.length)] 
        let buffer= fs.readFileSync(`commands/albums/${chosen}`);
        let parser = require('exif-parser').create(buffer);
        let result = parser.parse();
        console.log(result);
        let randRatings = (Math.random()*10).toPrecision(2);
        let rec = "";
        if(randRatings<2){
            rec = " **DON'T**"
        }
        else if(randRatings<4){
            rec = " don't really"
        }
        else if(randRatings<6){
            rec = " guess i"
        }
        else if(randRatings < 8){
            rec = ""
        }
        else if(randRatings < 9){
            rec = " really"
        } else rec = " **REALLY REALLY**";

        let albumName = new Discord.MessageEmbed().setTitle(`I${rec} recommend you to listen to **${result.tags['ImageDescription']}**`).setFooter(`I rate this album ${randRatings}/10`);
        await interaction.deferReply();
        await wait(300);
        await interaction.editReply({ embeds: [albumName], files: [buffer] });
    },
  };