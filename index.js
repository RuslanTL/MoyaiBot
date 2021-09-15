const { Client, Intents, Collection } = require('discord.js');
const { token, prefix } = require('./config.json');
const fs = require("fs")
var gis = require('g-i-s');
const image_finder = require("image-search-engine");
const chalk = require('chalk')
const client = new Client({
	 intents:	[Intents.FLAGS.GUILDS] 
	});
client.commands = new Collection();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let artistlist = fs.readFileSync('./tracklist.txt', {encoding:'utf8', flag:'r'})
let artists = artistlist.split(", ")



for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
  
	client.commands.set(command.data.name, command);
}

const modlog = "885652246988218449";

client.once('ready', () => {
	//once ready,  choose random artist from the artist list
	let artistpick = artists[Math.floor(Math.random()*artists.length)]
	//set status as listening to selected artist
	client.user.setActivity(artistpick, { type: 'LISTENING' });
	console.log('MoyaiBot ready!');
	const currentTime = new Date();


	//periodically change the artist the bot is "listening" to 
	setInterval(() => {
		artistpick = artists[Math.floor(Math.random()*artists.length)]
		client.user.setActivity(artistpick, { type: 'LISTENING' });
	}, 5*60*1000);
	setInterval(() => {
		client.channels.cache.get(modlog).send('<@&885637749619687465> its time to bump')
	}, 125*60*1000);
});
client.on('interactionCreate', async interaction => {
	//check if users interaction was a command
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'error lol', ephemeral: false});
	}
});

client.login(token);
