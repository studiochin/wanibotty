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

    const statsResult = await fetchReviewStats(token);
    const reports = await fetchSummaryReport(token);
    const assignments = await fetchAssignments(token);

    assignments.then((res) => {
      let resultsToReturn = {
        totalAssignments: 0,
        apprenticeCount: 0,
        guruCount: 0,
        masterCount: 0,
        englightenedCount: 0,
        brunedCount: 0,
      };

      resultsToReturn.totalAssignments = results.total_count;

      res.forEach((assignment) => {
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

      userData.totalAssignments = resultsToReturn.totalAssignments;
      userData.apprenticeCount = resultsToReturn.apprenticeCount;
      userData.guruCount = resultsToReturn.guruCount;
      userData.masterCount = resultsToReturn.masterCount;
      userData.englightenedCount = resultsToReturn.englightenedCount;
      userData.burnedCount = resultsToReturn.burnedCount;
    });

    statsResult.then((res) => {
      userData.level = res.data.level;
      userData.startedLevelAt = res.data.started_at;
      userData.unlockedLevelAt = res.data.unlocked_at;
      userData.passedLevelAt = res.data.passed_at;
    });

    reports.then((res) => {
      userData.nextReviewsAt = res.next_reviews_at;
    });

    await userData.save();
    await interaction.reply(`sync complete`);
  },
};
