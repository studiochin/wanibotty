const { SlashCommandBuilder } = require('@discordjs/builders');
const { encrypt } = require("../../src/utils.js");
const userSchema = require("../../models/userSchema.js");
const userDataSchema = require("../../models/userDataSchema.js");
const { request } = require('undici');
const { OpenAi } = require('openai');


module.exports = {
	data: new SlashCommandBuilder().setName('translate').setDescription('translates the kanji'),
    execute: async (interaction) => {
        console.log(interaction);
		await interaction.reply("openai");
	},
};