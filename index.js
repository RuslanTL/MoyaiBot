const { Client, Intents, Collection } = require('discord.js');
const { token, prefix } = require('./config.json');
const fs = require("fs")
var gis = require('g-i-s');
const image_finder = require("image-search-engine");
const chalk = require('chalk')
const client = new Client({
	 intents:	[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
	});
const Markov = require('markov-strings').default
client.commands = new Collection();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let artistlist = fs.readFileSync('./tracklist.txt', {encoding:'utf8', flag:'r'})
let artists = artistlist.split(", ")
const markov = new Markov({ stateSize: 2 })


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
  
	client.commands.set(command.data.name, command);
}

const modlog = "885652246988218449";
let messagedata = [];
let isMarkov = false;

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
client.on('messageCreate', async message =>{
	if(message.content.startsWith("m!")){
		if(message.content.includes("markov")){
			if(isMarkov == false){
				isMarkov = true;
				message.channel.send("markov activated!");
			} else{
				isMarkov = false;
				message.channel.send("markov deactivated!");
			}
		}
	}
	//takes the message and splits it into an array. need to have it 
	if(message.author.bot){return}
	else{
		let words = message.content.split(' ').join('\n')
		let log = fs.createWriteStream('messages.txt', {
			flags: 'a' 
		  })
		log.write(words + '\n');
		let messagestream = fs.readFileSync('./messages.txt', {encoding:'utf8', flag:'r'});
		messagedata = messagestream.split('\n')
	}
	markov.addData(messagedata)
	if(isMarkov){
		const options = {
			maxTries: 20, // Give up if I don't have a sentence after 20 tries (default is 10)
			prng: Math.random, // Default value if left empty
			// You'll often need to manually filter raw results to get something that fits your needs.
			filter: (result) => {
			   return result.string.split(' ').length >= 3
			}
		  }
		try{	
			const result = markov.generate(options);
			console.log(result);
		}
		catch(error){
			message.channel.send("error!");
		}
	}
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


//poop
client.login(token);
