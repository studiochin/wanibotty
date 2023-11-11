const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder().setName('mystats').setDescription('get general stats'),
	async execute(interaction) {
		console.log("go to github hosted static site, fill in data, screenshot, then send to chat");

        console.log("go to github hosted static site, fill in data, screenshot, then send to chat");

		await interaction.reply(`here u are`);
	},
};