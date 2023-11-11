const { SlashCommandBuilder } = require('@discordjs/builders');
const userSchema = require("../../models/userSchema.js");
const userDataSchema = require("../../models/userDataSchema.js");

module.exports = {
    data: new SlashCommandBuilder().setName('unhandmeyoupeasant').setDescription('unlink account'),
    async execute(interaction) {

        await userSchema.deleteOne({userId: interaction.user.id});
        await userDataSchema.deleteOne({userId: interaction.user.id});

        await interaction.reply(`バイバイ`);
    },
};