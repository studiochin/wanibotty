const botMessageCreateReplies = {
  やばい: (name) => {
    return `no, ${name} you're yabbai`;
  },
  めっちゃ: (name) => {
    return `${name} can meccha deez nuts 🥜`;
  },
  くそ野郎: (name) => {
    return `${name} can eat my shiitake. どうぞう`;
  },
};

const keywordsToListenFor = ["やばい", "めっちゃ", "くそ野郎"];

exports.onMessageCreate = async (interaction) => {
  const name = interaction.author.globalName;

  if (!name) {
    return;
  }

  // if message contains word from the array
  keywordsToListenFor.forEach((keyword) => {
    if (interaction.content.indexOf(keyword) >= 0) {
      interaction.reply(botMessageCreateReplies[keyword](name));
    }
  });
};
