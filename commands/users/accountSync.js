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
    const userData = fetchUserData();

    if (!userData) {
      await interaction.reply(botErrorReplies("userNotFound"));
      return;
    }

    if (!isPastMinimumUpdateTime(userData)) {
      await interaction.reply(botErrorReplies("minimumUpdateTine"));
      return;
    }

    // use this logic for syning
    const token = decrypt({
      encryptedData: userData.token,
      iv: userData.iv,
    });

    const statsResult = await fetchReviewStats(token);
    await userData.udpateOne({ totalReviewsDone: statsResult.total_count });
    await interaction.reply(`sync complete`);
  },
};
