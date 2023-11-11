const { SlashCommandBuilder } = require('@discordjs/builders');
const { encrypt } = require("../../src/utils.js");
const userSchema = require("../../models/userSchema.js");
const userDataSchema = require("../../models/userDataSchema.js");
const { request } = require('undici');


module.exports = {
	data: new SlashCommandBuilder()
  .setName('register')
  .setDescription('Register your wani kani account')
  .addStringOption(option => option
  .setName('api_token')
  .setDescription('Your WaniKani API token (from your settings)')
  .setRequired(false)),
	execute: async (interaction) => {

    const isAlreadyRegistered = await userSchema.findOne({userId: interaction.user.id}).exec();

    if (isAlreadyRegistered) {
      await interaction.reply(`u already registered homie, if you want to disconnected, use command /unhandmeyoupeasant`);
      return;
    }

    const apiToken = interaction.options._hoistedOptions[0].value.trim();
    const requestAuth =  await request("https://api.wanikani.com/v2/user", { headers: {Authorization: 'Bearer ' + apiToken}});
    const results = await requestAuth.body.json();
    const data = results.data;

    if (data) {
      await userSchema.create({
        userId: interaction.user.id,
        serverId: interaction.guild.id
      }).then(() => {
        const encryptedToken = encrypt(interaction.options._hoistedOptions[0].value);
        userDataSchema.create({
          userId: interaction.user.id, 
          token: encryptedToken.encryptedData,
          iv: encryptedToken.iv,
          level: data.level,
          maxLevel: data.subscription.max_level_granted,
          lastUpdatedAt: data.data_updated_at
        });
          
      });
    } else {
      await interaction.reply(`this a phony token`);
      return;
    }


		await interaction.reply(`ありがとう、${interaction.user.globalName}さん。You are now registered`);
	},
};