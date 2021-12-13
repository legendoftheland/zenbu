// Loads up environment variables
require('dotenv').config();

const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents, Collection } = require('discord.js');
const { MessageEmbed } = require("discord.js")

const mongoose = require('../database/mongoose.js')

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

// Credit to the creators of MaxiGames for these lines of code that register the commands. 

const commandFiles = fs
    .readdirSync(`./commands`)
    .map((file) => path.join("./commands", file))
    .filter((file) => fs.lstatSync(file).isDirectory())
    .map((dir) => fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".js"))
        .map((file) => path.join(dir, file))
    );
console.log(commandFiles)


const commands = [];

client.commands = new Collection();

for (const filecol of commandFiles) {
	for (const name of filecol) {
		const command = require(`../${name}`);
		commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
		console.log(`Registered ${name}.`);
	}
}




client.once('ready', async () => {
    client.user.setActivity({name: 'for slash commands', type: 'WATCHING'});
    console.log(`Logged in as ${client.user.tag}.`);
    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: 9
    }).setToken(process.env.BOT_TOKEN);

    (async () => {
        try {
            if (process.env.ENV === "production") {
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                });
                console.log("Successfully registered commands globally.");
            } else {
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.SUPPORT_GUILD_ID), {
                    body: commands
                });
                console.log("Successfully registered commands locally.");
            }
        } catch (err) {
            if (err) console.error(err);
        }
    })();
    
});

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try {
        await command.execute(interaction);
    } catch(err) {
        if (err) console.error(err);

        // EMBEDS
        const errorEmbed = new MessageEmbed()
            .setColor("#FF5757")
            .setTitle("An error occurred")
            .setDescription("I encountered an error whilst trying to execute that command. Please try again later.\n\
            If this problem persists, please join my support server and contact the support team.");

        await interaction.reply({
            embeds: [errorEmbed],
            ephemeral: true
        });
    }
});

mongoose.init();
client.login(process.env.BOT_TOKEN);

module.exports = client;