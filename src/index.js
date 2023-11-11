const { Client, IntentsBitField, Events, Collection, REST,Routes } = require("discord.js");
require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const mongoDBUrl = process.env.MONGODBURL;

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, '../commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			console.log("the comands goin in" , command)
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on('ready', async () => {

	if (!mongoDBUrl) {
		return;
	}
	await mongoose.connect(mongoDBUrl || '', {
		serverSelectionTimeoutMS: 15000
	});

	if (mongoose.connect) {
		console.log("DATABASE CONNECTED");
	}

	console.log('ready for commands!');

});

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
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on(Events.MessageCreate, async (interaction) => {
	const name = interaction.author.globalName;

	if (interaction.content.indexOf('やばい') >= 0 ) {
		await interaction.reply(`no, ${name} you're meccha yabbai`);
	}

	if (interaction.content.indexOf('めっちゃ') >= 0 ) {
		await interaction.reply(`${name} can meccha deez nuts 🥜`);
	}

	if (interaction.content.indexOf('くそ野郎') >= 0) {
		await interaction.reply(`${name} can eat my shiitake. どうぞう`);
	}

});

client.login(process.env.TOKEN);
