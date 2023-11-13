const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  fetchUserData,
  botErrorReplies,
  convertDate
} = require("../../src/utils.js");

// const statsOutput = (data) => {
//   return `here u are: your level: ${data.level} \n reviews done: ${data.totalReviewsDone}`;
// };

const statsOutputFromDb = (userData) => {
  return `
  level: ${userData.level}
  started level at: ${convertDate("long", userData.startedLevelAt)}
  unlocked level at: ${convertDate("long", userData.unlockedLevelAt)}
  ${convertDate("countdown", userData.nextReviewsAt)}`;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mystats")
    .setDescription("get general stats"),
  async execute(interaction) {
    const userData = await fetchUserData(interaction.user.id);

    if (!userData) {
      await interaction.reply(botErrorReplies("userNotFound"));
      return;
    }
    await interaction.reply(statsOutputFromDb(userData));
  },
};
