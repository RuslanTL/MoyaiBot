
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);        
const fspromises = require("fs/promises")
const fs = require("fs");
const Discord = require('discord.js');
const image_finder = require("image-search-engine");
var gis = require('g-i-s');
let artistlist = fs.readFileSync('./tracklist.txt', {encoding:'utf8', flag:'r'})
let artists = artistlist.split(", ")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('artistrec')
        .setDescription('recommends an artist'),
    async execute(interaction) {
        await interaction.deferReply();
        let pick = artists[Math.floor(Math.random()*artists.length)]
        console.log(pick);
        function gisPromise(opts) {
            return new Promise((resolve, reject) => {
              gis(opts, (error, results) => {
                if (error) reject(error);
                else resolve(results);
              });
            });
        }
        const results = await gisPromise(pick)
        let range = Math.floor(Math.random() * 10 )
        let imageURL = results[range].url;
        console.log(imageURL);
        console.log("url loaded");  
        let artistImage = new Discord.MessageEmbed().setTitle(`You should listen to: **__${pick}!__**`).setImage(imageURL).setFooter("🗿 Yours truly, MoyaiBot 🗿");
        console.log(artistImage);
        await wait(300);
        await interaction.editReply({embeds: [artistImage]});
    },
  };