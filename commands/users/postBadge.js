const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  fetchUserData,
  botErrorReplies,
  convertDate
} = require("../../src/utils.js");

// const statsOutput = (data) => {
//   return `here u are: your level: ${data.level} \n reviews done: ${data.totalReviewsDone}`;
// };


module.exports = {
  data: new SlashCommandBuilder()
    .setName("postbadge")
    .setDescription("get badge"),
  async execute(interaction) {
    // const userData = await fetchUserData(interaction.user.id);

    // if (!userData) {
    //   await interaction.reply(botErrorReplies("userNotFound"));
    //   return;
    // }
    await interaction.reply(`asdf`);
  },
};
