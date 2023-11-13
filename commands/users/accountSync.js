const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  decrypt,
  fetchReviewStats,
  fetchUserData,
  isPastMinimumUpdateTime,
  botErrorReplies,
} = require("../../src/utils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sync")
    .setDescription("update to latest profile data"),
  execute: async (interaction) => {
    const userData = await fetchUserData(interaction.user.id);

    if (!userData) {
      await interaction.reply(botErrorReplies("userNotFound"));
      return;
    }

    // if (!isPastMinimumUpdateTime(userData)) {
    //   await interaction.reply(botErrorReplies("minimumUpdateTine"));
    //   return;
    // }

    // use this logic for syning
    const token = decrypt({
      encryptedData: userData.token,
      iv: userData.iv,
    });


    const statsResult = await fetchReviewStats(token);
    console.log(statsResult);
    userData.startedLevelAt = statsResult.data.started_at;
    userData.unlockedLevelAt = statsResult.data.unlocked_at;
    userData.passedLevelAt = statsResult.data.passed_at;

    await userData.save();
    await interaction.reply(`sync complete`);
  },
};
