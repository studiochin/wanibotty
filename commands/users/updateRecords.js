const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder().setName('updaterecordsfoo').setDescription('update everyones records with latest. can be used with cronjob'),
	async execute(interaction) {
		console.log("for each registered user, decrypt key, send api request, then update tables and save");
		await interaction.reply(`here u are`);
	},
};