const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
  .setName('register')
  .setDescription('Register your wani kani account')
  .addStringOption(option => option
  .setName('api_token')
  .setDescription('Your WaniKani API token (from your settings)')
  .setRequired(false)),
	execute: async (interaction) => {

    console.log(`getting api token, 
    if already in db, 
      update reply and return.. 
      otherwise, 
      test if valid api-key, 
      encrypt, 
    store to db. `);

		await interaction.reply(`ありがとう、${interaction.user.globalName}さん。You are now registered`);
	},
};