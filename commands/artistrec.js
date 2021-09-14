
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
        .setDescription('recommends a random artist'),
    async execute(interaction) {
       let imageURL;
       function logResults(error, results) {
            if (error) {
                console.log(error);
            }
            else {
                //console.log(JSON.stringify(results, null, ' '))
            }
        }
        let pick = artists[Math.floor(Math.random()*artists.length)]
        function gisPromise(opts) {
            return new Promise((resolve, reject) => {
              gis(opts, (error, results) => {
                if (error) reject(error);
                else resolve(results);
              });
            });
        }
        await gisPromise(pick).then((results)=>{
            let imageURL = results[0].url;
            console.log(imageURL);
            //initialising artistImage
            let artistImage = new Discord.MessageEmbed().setTitle(pick).setImage(imageURL);
        }).catch((error) => {
            console.log(error);
        })
        console.log(pick);
        //artistImage needs to be defined here
        console.log(artistImage);


        //after the image part is done with, the embed should also include "i recommend ${artist} blah blah blah"



        await interaction.deferReply();
        await wait(300);
        await interaction.editReply({embeds: [artistImage]});
        console.log("command finished")
    },
  };