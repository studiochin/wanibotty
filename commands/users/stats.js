const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  decrypt,
  fetchReviewStats,
  fetchUserData,
  isPastMinimumUpdateTime,
} = require("../../src/utils.js");

const statsOutput = (data) => {
  return `here u are: your level: ${data.level} \n reviews done: ${data.totalReviewsDone}`;
};

const statsOutputFromDb = (userData) => {
  return `here u are => level: ${userData.level} \n reviews done: ${userData.totalReviewsDone}`;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mystats")
    .setDescription("get general stats"),
  async execute(interaction) {
    // if stats
    const userData = fetchUserData();
    if (!isPastMinimumUpdateTime(userData.lastUpdatedAt)) {
      // just get from db
      await interaction.reply(statsOutputFromDb(userData));
      return;
    }

    const token = decrypt({
      encryptedData: userData.token,
      iv: userData.iv,
    });

    const statsResult = await fetchReviewStats(token);

    // auto sync
    await userData.udpateOne({ totalReviewsDone: statsResult.total_count });

    //
    await interaction.reply(statsOutput(statsResult));
  },
};
