const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('sync')
    .setDescription('update to latest profile data'),
    execute: async (interaction) => {

    console.log("if < 30 mins ago dont update. can sync after x minutes");

    console.log("if > 30mins, go to db, decrypt, then pull latest from wanikani");

    console.log("update fields in mongoose data");
        await interaction.reply(`all synced up. run /stats for a summary :)`);
    },
};