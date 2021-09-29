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
const markov2 = new Markov({ stateSize: 2 })

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
  
	client.commands.set(command.data.name, command);
}

const modlog = "885652246988218449";
const MCgeneral = "885637180884676721";

const MC = "885637180339408968";
const MF = "580042590985125898"

let messagedata = [];
let isMarkov = false;
let markov_probability = 5;

let messagecount = 0;
let artistpick;
let markov_channel;

const splash = fs.readFileSync('./splash.txt',{encoding:'utf8', flag:'r'})
//this is the message cooldown for the bot's random messages (currently only "currently listening artist" as seen on line 61)
//it decreases the more people chat and increases when there hasn't been activity in the channel for a while, to prevent it from spamming during inactive times

client.once('ready', () => {
	//once ready,  choose random artist from the artist list
	artistpick = artists[Math.floor(Math.random()*artists.length)]
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
			markov_channel = message.channelId;
			if(isMarkov == false){
				isMarkov = true;
				client.channels.fetch(markov_channel)
				.then(channel => channel.send("markov activated!"))
			} else{
				isMarkov = false;
				client.channels.fetch(markov_channel)
				.then(channel => channel.send("markov deactivated!"))
			}
		}
		if(message.content.includes("prob")){
			let args = message.content.split(' ')[1];
			console.log(`args: ${args}`);
			markov_probability = args;
			message.channel.send(`probability set to ${markov_probability}!`)
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
		console.log(words + ` from ${message.guild}`);
		let log = fs.createWriteStream('messages.txt', {
			flags: 'w' 
			})
		log.write(words + '\n');
		let messagestream = fs.readFileSync('./messages.txt', {encoding:'utf8', flag:'r'});
		messagedata = messagestream.split('\n')
		console.log(messagedata);
		let backup = fs.readFileSync('./markovbackup.txt',{encoding:'utf8', flag:'r'});
		let importdata = fs.readFileSync('./markovcorpus.txt',{encoding:'utf8', flag:'r'});
		fs.writeFile('markovbackup.txt', backup, (err) => {
			if (err) throw err;
		});
		try{
			markov.import(JSON.parse(importdata))
			fs.writeFile('markovbackup.txt', importdata, (err) => {
				if (err) throw err;
			});
		} catch(err){
			console.log("error while getting corpus, using backup")
			message.channel.send("error while getting corpus, using backup")
			markov.import(JSON.parse(backup));
			fs.writeFile('markovcorpus.txt', backup, (err) => {
				if (err) throw err;
			});
		}
		markov.addData(messagedata)
		fs.writeFile('markovcorpus.txt', JSON.stringify(markov.export()), (err) => {
			if (err) throw err;
		});
		let randlength = Math.floor(Math.random()*8)
		let randref = Math.ceil(Math.random()*3);
		markov_channel = message.channelId;
		const options = {	
			maxTries: 1000, // Give up if I don't have a sentence after 20 tries (default is 10)
			prng: Math.random, // Default value if left empty
			// You'll often need to manually filter raw results to get something that fits your needs.
			filter: (result) => {
				return result.string.split(' ').length >= randlength && result.refs.length > randref;
			}
		}
		if(isMarkov){
			let markov_pick = Math.floor(Math.random()*100)
			console.log(chalk.yellowBright(`markov pick: ${markov_pick}, markov probability: ${markov_probability} from collective`));
			if(markov_pick <= markov_probability){
				try{
					const result = await markov.generate(options);
					console.log(result);
					console.log(chalk.blueBright(`min length: ${randlength}, min ref amount: ${randref}`));
					client.channels.fetch(markov_channel)
					.then(channel => channel.send(result.string))
				}
				catch(error){
					console.log(error);
					message.channel.send("error!!!! :(");
				}
			}
		}
	}
	if(message.guildId == MF){
		if(message.author.bot){return}
		let words = message.content
		let attach = message.attachments.first();
		if(attach != undefined){
			let attachURL = attach.url;
			words += `\n${attachURL}`
		}
		console.log(words + ` from ${message.guild}`);
		let log = fs.createWriteStream('messages2.txt', {
			flags: 'w' 
			})
		log.write(words + '\n');
		let messagestream = fs.readFileSync('./messages2.txt', {encoding:'utf8', flag:'r'});
		messagedata = messagestream.split('\n')
		console.log(messagedata);
		let backup2 = fs.readFileSync('./markovbackup2.txt',{encoding:'utf8', flag:'r'});
		let importdata2 = fs.readFileSync('./markovcorpus2.txt',{encoding:'utf8', flag:'r'});
		fs.writeFile('markovbackup2.txt', backup2, (err) => {
			if (err) throw err;
		});
		try{
			markov2.import(JSON.parse(importdata2))
			fs.writeFile('markovbackup2.txt', importdata2, (err) => {
				if (err) throw err;
			});
		} catch(err){
			console.log("error while getting corpus, using backup")
			message.channel.send("error while getting corpus, using backup")
			markov2.import(JSON.parse(backup2));
			fs.writeFile('markovcorpus2.txt', backup2, (err) => {
				if (err) throw err;
			});
		}
		markov2.addData(messagedata)
		fs.writeFile('markovcorpus2.txt', JSON.stringify(markov2.export()), (err) => {
			if (err) throw err;
		});
		let randlength = Math.floor(Math.random()*20)
		let randref = Math.ceil(Math.random()*5);
		const options = {	
			maxTries: 1000, // Give up if I don't have a sentence after 20 tries (default is 10)
			prng: Math.random, // Default value if left empty
			// You'll often need to manually filter raw results to get something that fits your needs.
			filter: (result) => {
				return result.string.split(' ').length >= randlength && result.refs.length > randref;
			}
		}
		if(isMarkov){
			let markov_pick = Math.floor(Math.random()*100)
			console.log(chalk.yellowBright(`markov pick: ${markov_pick}, markov probability: ${markov_probability} from moyai`));
			if(markov_pick <= markov_probability){
				try{
					const result = await markov2.generate(options);
					console.log(result);
					console.log(chalk.blueBright(`min length: ${randlength}, min ref amount: ${randref}`));
					client.channels.fetch(markov_channel)
					.then(channel => channel.send(result.string))
				}
				catch(error){
					console.log(error);
					message.channel.send("error!!!! :(");
				}
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
