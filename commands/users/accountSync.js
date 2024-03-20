const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  decrypt,
  fetchReviewStats,
  fetchUserData,
  isPastMinimumUpdateTime,
  botErrorReplies,
  fetchSummaryReport,
  fetchAssignments,
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

    await fetchReviewStats(token).then((res) => {
      const results = res.body.json();
      results.then((data) => {
        const resp = data;
        // userData.level = resp.level;
        // userData.startedLevelAt = resp.started_at;
        // userData.unlockedLevelAt = resp.unlocked_at;
        // userData.passedLevelAt = resp.passed_at;
      });
    });

    await fetchSummaryReport(token).then((res) => {
      const stuff = res.body.json();
      stuff.then((data) => {
        console.log(data);
        userData.nextReviewsAt = data.next_reviews_at;
      });
    });

    await fetchAssignments(token).then((res) => {
      const results = res.body.json();
      let resultsToReturn = {
        totalAssignments: 0,
        apprenticeCount: 0,
        guruCount: 0,
        masterCount: 0,
        englightenedCount: 0,
        brunedCount: 0,
      };

      results.then((data) => {
        resultsToReturn.totalAssignments = data.data.total_count;

        data.data.forEach((assignment) => {
          let assignmentData = assignment.data;
          if (assignmentData.srs_stage >= 0 && assignmentData.srs_stage <= 4) {
            resultsToReturn.apprenticeCount++;
          }
          if (assignmentData.srs_stage >= 5 && assignmentData.srs_stage <= 6) {
            resultsToReturn.guruCount++;
          }
          if (assignmentData.srs_stage >= 7 && assignmentData.srs_stage < 8) {
            resultsToReturn.masterCount++;
          }

          if (assignmentData.srs_stage >= 8) {
            resultsToReturn.englightenedCount++;
          }
        });
      });

      userData.totalAssignments = resultsToReturn.totalAssignments;
      userData.apprenticeCount = resultsToReturn.apprenticeCount;
      userData.guruCount = resultsToReturn.guruCount;
      userData.masterCount = resultsToReturn.masterCount;
      userData.englightenedCount = resultsToReturn.englightenedCount;
      userData.burnedCount = resultsToReturn.burnedCount;
    });

    await userData.save();
    await interaction.reply(`sync complete`);
  },
};
