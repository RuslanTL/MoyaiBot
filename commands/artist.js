
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);        
const fs = require("fs")
const Discord = require('discord.js');
const image_finder = require("image-search-engine");

var gis = require('g-i-s');
let artistlist = fs.readFileSync('./tracklist.txt', {encoding:'utf8', flag:'r'})
let artists = artistlist.split(", ")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('artist')
        .setDescription('artist'),
    async execute(interaction) {
        function logResults(error, results) {
            let image;
            try{
                image = results[0].url;
                console.log(image);
                fs.writeFile("artisturl.txt", image, (err) => {
                    if(err){
                        console.log(err);
                    } else{
                        console.log(`${image} written to artisturl.txt`);
                    }
                })
            } catch(er){
                console.log(er);
            }
        }
        let pick = artists[Math.floor(Math.random()*artists.length)]
        console.log(pick);
        gis(pick, logResults);
        let artistImage = await new Discord.MessageEmbed().setTitle(pick).setImage(fs.readFileSync("artisturl.txt", "utf8"));
        await interaction.deferReply();
        await wait(300);
        await interaction.editReply({embeds: [artistImage]});
    },
  };