const {
  Client,
  IntentsBitField,
  Events,
  Collection,
  MessageType,
} = require("discord.js");
require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const { onMessageCreate } = require("./messageCreate.js");
const { OpenAI } = require("openai");
const mongoDBUrl = process.env.MONGODBURL;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});


const openai = new OpenAI({apiKey: process.env.OPENAI, organization: process.env.ORG});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "../commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.on("ready", async () => {
  if (!mongoDBUrl) {
    return;
  }
  await mongoose.connect(mongoDBUrl || "", {
    serverSelectionTimeoutMS: 15000,
  });

  if (mongoose.connect) {
    console.log("DATABASE CONNECTED");
  }


});

// when user uses one fo the commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!mongoose.connect) {
    console.error("db not up");
    return;
  }

  if (!interaction.isCommand()) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  const command = interaction.client.commands.get(interaction.commandName);

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// when user sends something
client.on(Events.MessageCreate, async (interaction) => {
  onMessageCreate(interaction);

  if (interaction.type == MessageType.Reply && interaction.content == "replyinjapanese") {
    const reference = await interaction.fetchReference();
    const completion = await openai.chat.completions.create({
      messages: [{"role": "user", "content": `reply to this sentence in japanese with hirigana next to kanji: ${reference.content}`}
      ],
      model: "gpt-3.5-turbo",
    });
    await interaction.reply(`${completion.choices[0].message.content}`); 
   }

  if (interaction.content == "catchthesegrammatichands") {
    const completion = await openai.chat.completions.create({
      messages: [{"role": "user", "content": `give us a random grammar topic from the N4 or N5 category for the JLPT and teach it some important topics about it. keep it to 3 short bullet points`}
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 2000
    });
    await interaction.reply(`${completion.choices[0].message.content}`);
  }

  if (interaction.type == MessageType.Reply && interaction.content == "translatekanji") {
    const reference = await interaction.fetchReference();
    const completion = await openai.chat.completions.create({
      messages: [{"role": "user", "content": `translate all the kanji into hirigana and rewrite the sentence back to me: ${reference.content}`}
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 200
    });
    await interaction.reply(`${completion.choices[0].message.content}`);
  
  }
});

client.login(process.env.TOKEN);
