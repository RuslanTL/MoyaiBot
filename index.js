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

const MC = "885637180339408968";

let messagedata = [];
let isMarkov = false;

let messagecount = 0;

const splash = fs.readFileSync('./splash.txt',{encoding:'utf8', flag:'r'})
//this is the message cooldown for the bot's random messages (currently only "currently listening artist" as seen on line 61)
//it decreases the more people chat and increases when there hasn't been activity in the channel for a while, to prevent it from spamming during inactive times

client.once('ready', () => {
	//once ready,  choose random artist from the artist list
	let artistpick = artists[Math.floor(Math.random()*artists.length)]
	//set status as listening to selected artist
	client.user.setActivity(artistpick, { type: 'LISTENING' });
	const currentTime = new Date();
	console.log(chalk.black.bgWhite(splash));
	console.log(chalk.white('by desmond and capn'));
	console.log(chalk.blue.bgWhite('MoyaiBot ready!') + ' | ' + `at ` + chalk.green(`${currentTime}`));
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
	//takes the message and splits it into an array.
	if(message.guildId == MC&& message.channelId != "890349764514832394" && message.channelId != "885646595889180733"){
		if(message.author.bot){return}
		//decreasing cooldown when people are talking
		messagecount += 1;
		console.log(chalk.redBright(messagecount));
		if(messagecount == 100){
			let artistImage = new Discord.MessageEmbed().setTitle(`I am currently listening to: **__${artistpick}!__** What is your opinion on this artist?`).setFooter("🗿 Yours truly, MoyaiBot 🗿");
			client.channels.cache.get(MCgeneral).send({embeds: [artistImage]})
			console.log(chalk.redBright("random message sent!"));
			messagecount = 0;
		}
		let words = message.content
		let attach = message.attachments.first();
		if(attach != undefined){
			let attachURL = attach.url;
			words += `\n${attachURL}`
		}
		console.log(words);
		let log = fs.createWriteStream('messages.txt', {
			flags: 'w' 
			})
		log.write(words + '\n');
		let messagestream = fs.readFileSync('./messages.txt', {encoding:'utf8', flag:'r'});
		messagedata = messagestream.split('\n')
		console.log(messagedata);
		markov.import(JSON.parse(fs.readFileSync('./markovcorpus.txt',{encoding:'utf8', flag:'r'})))
		markov.addData(messagedata)
		console.log(markov.corpus);
		fs.writeFile('markovcorpus.txt', JSON.stringify(markov.export()), (err) => {
			if (err) throw err;
		});

		const options = {
			maxTries: 500, // Give up if I don't have a sentence after 20 tries (default is 10)
			prng: Math.random, // Default value if left empty
			// You'll often need to manually filter raw results to get something that fits your needs.
			filter: (result) => {
			   return result.string.split(' ').length >= 2
			}
		}
		if(isMarkov){
			try{	
				const result = await markov.generate(options);
				console.log(result);
				message.channel.send(result.string);
				if(message.mentions.users.has(message.client.user)){
					
				}

			}
			catch(error){
				console.log(error);
				message.channel.send("error!!!! :(");
			}
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
