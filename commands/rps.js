const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Play Rock Paper Scissors')
		.addStringOption(option => option.setName('input').setDescription('Choose Rock, Paper, or Scissors')),
	async execute(interaction) {
		const wait = require('util').promisify(setTimeout);
		const userChoice = interaction.options.getString('input');
		const choices = ['rock', 'paper', 'scissors'];
		const botChoice = choices[Math.floor(Math.random() * choices.length)];

		// 0=bot, 1=player, 2=tie
		let winner = 0;

		// If the player types something that's not a valid choice
		if (choices.indexOf(userChoice.toLowerCase()) === -1) {
			await interaction.reply(`Must enter Rock, Paper, or Scissors! Player chose: ${userChoice}`);
			return;
		}

		if (userChoice === botChoice) {
			winner = 2;
		}
		else if (userChoice === 'paper') {
			if (botChoice === 'scissors') {
				winner = 1;
			}
			else {
				winner = 0;
			}
		}
		else if (userChoice === 'rock') {
			if (botChoice === 'paper') {
				winner = 1;
			}
			else {
				winner = 0;
			}
		}
		else if (userChoice === 'scissors') {
			if (botChoice === 'rock') {
				winner = 1;
			}
			else {
				winner = 0;
			}
		}

		await interaction.reply(`Player chose: ${userChoice.toLowerCase()}`);
		let message = await interaction.fetchReply();
		await wait(500);
		await interaction.editReply(message.content + `\nBot chose: ${botChoice}`);
		message = await interaction.fetchReply();
		await wait(500);

		switch (winner) {
		case 0:
			await interaction.editReply(message.content + '\nPlayer wins!');
			return;
		case 1:
			await interaction.editReply(message.content + '\nBot wins!');
			return;
		case 2:
			await interaction.editReply(message.content + '\nIt\'s a tie!');
			return;
		}
	},
};
