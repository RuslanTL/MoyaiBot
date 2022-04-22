const Discord = require('discord.js');
const genius_token = "Ro49kZoRzsF3Knzs_mPrxkMibrJzI5TLCHtTvh90_UZc45ELoel3rSGxGbVibFi3"
const { getLyrics, getSong } = require('genius-lyrics-api');
const { SlashCommandBuilder } = require('@discordjs/builders');
//const gis = require('g-i-s');
//const wait = require('util').promisify(setTimeout);       
//const jimp = require('jimp');
//const fs = require("fs");
module.exports = {
  data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('search up the lyrics of a song!')
        .addStringOption(option =>
            option.setName("artist")
                .setDescription("the artist of the song")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('song')
                .setDescription("the name of the song")
                .setRequired(true)),
  async execute(interaction) {
        await interaction.deferReply();
        const artist = interaction.options.getString("artist");
        const song = interaction.options.getString("song");
        let title;
        let lyric;
        let albumArt;
        try{
            let options = {
                apiKey: genius_token,
                title: song,
                artist: artist,
                optimizeQuery: true
            };
            title = await getSong(options).then((song) => song.title);
            lyric = await getLyrics(options).then((lyrics) => lyrics);
            albumArt = await getSong(options).then((song) => song.albumArt);
                        /*
            function gisPromise(opts) {
                return new Promise((resolve, reject) => {
                gis(opts, (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                });
                });
            }
            const results = await gisPromise(artist)
            let range = Math.floor(Math.random() * 10 )
            let imageURL = results[range].url;
            */
            try{
                let lyricEmbed = new Discord.MessageEmbed().setTitle(`__**${title}**__ `).setThumbnail(albumArt).setDescription(`${lyric} \n\n *powered by Genius *  <:genius:891996931436478464>`).setFooter("🗿 Yours truly, MoyaiBot 🗿");
                await interaction.editReply({embeds:[lyricEmbed]});
            } catch(err){
                console.log(err);
                await interaction.editReply(`error! the lyrics might be too long (i know you're trying to search up beach life in death, bitch)`);
            }
        } catch(err){
            console.log(err);
            await interaction.editReply(`could not find lyrics to ${artist} - ${song}! `);
        }

  },
};