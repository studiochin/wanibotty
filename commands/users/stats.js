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
  return `here u are => level: ${userData.level} \nstarted level at: ${convertDate(userData.startedLevelAt)
  }\nunlocked level at: ${ convertDate(userData.unlockedLevelAt)}`;
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
    console.log(userData);
    await interaction.reply(statsOutputFromDb(userData));
  },
};
