const { Client, Intents, Collection } = require('discord.js');
const Discord = require('discord.js')
const { token, prefix } = require('./config.json');
const fs = require("fs")
let gis = require('g-i-s');
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
const MCgeneral = "885637180884676721";
let messagedata = [];
let isMarkov = false;

const splash = fs.readFileSync('./splash.txt',{encoding:'utf8', flag:'r'})
//this is the message cooldown for the bot's random messages (currently only "currently listening artist" as seen on line 61)
//it decreases the more people chat and increases when there hasn't been activity in the channel for a while, to prevent it from spamming during inactive times
let messagetime = 60; //minutes
let upperlimit = 70; //upperlimit

client.once('ready', () => {
	messagetime = 60;

	//once ready,  choose random artist from the artist list
	let artistpick = artists[Math.floor(Math.random()*artists.length)]
	//set status as listening to selected artist
	client.user.setActivity(artistpick, { type: 'LISTENING' });
	const currentTime = new Date();
	console.log(chalk.black.bgWhite(splash));
	console.log(chalk.white('by desmond and capn'));
	console.log(chalk.blue.bgWhite('MoyaiBot ready!') + ' | ' + `at ` + chalk.green(`${currentTime}`));
	let artistImage = new Discord.MessageEmbed().setTitle(`I am currently listening to: **__${artistpick}!__** What is your opinion on this artist?`).setFooter("🗿 Yours truly, MoyaiBot 🗿");
	client.channels.cache.get(MCgeneral).send({embeds: [artistImage]})
	//periodically change the artist the bot is "listening" to 
	setInterval(() => {
		artistpick = artists[Math.floor(Math.random()*artists.length)]
		client.user.setActivity(artistpick, { type: 'LISTENING' });
	}, 5*60*1000);

	setInterval(() => {
		client.channels.cache.get(modlog).send('<@&885637749619687465> its time to bump')
	}, 125*60*1000);

	//increasing cooldown when people aren't talking
	setInterval(() =>{
		if(messagetime <= upperlimit){
			messagetime += 1;
			console.log(chalk.red(`random message cooldown: ${messagetime} `) + chalk.redBright(`upper limit: ${upperlimit} `));
		}
	}, 2*60*1000)

	setInterval(() => {
        let artistImage = new Discord.MessageEmbed().setTitle(`I am currently listening to: **__${artistpick}!__** What is your opinion on this artist?`).setFooter("🗿 Yours truly, MoyaiBot 🗿");
		client.channels.cache.get(MCgeneral).send({embeds: [artistImage]})
		upperlimit += 10;
	}, messagetime*60*1000)
});
client.on('messageCreate', async message =>{
	//decreasing cooldown when people are talking

	//takes the message and splits it into an array. need to have it 
	if(message.author.bot){return}
	else{
		upperlimit -= 10;
		if(messagetime >= 10){
			messagetime -= 1;
		}
		console.log(chalk.red(`random message cooldown: ${messagetime} `) + chalk.redBright(`upper limit: ${upperlimit} `));
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
