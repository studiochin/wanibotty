const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  decrypt,
  fetchReviewStats,
  fetchUserData,
  isPastMinimumUpdateTime,
  botErrorReplies,
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
    const userData = fetchUserData(interaction.user.id);

    if (!userData) {
      await interaction.reply(botErrorReplies("userNotFound"));
      return;
    }

    await interaction.reply(statsOutputFromDb(userData));
  },
};
