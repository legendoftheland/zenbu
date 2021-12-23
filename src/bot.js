// Loads up environment variables
require('dotenv').config();

const Discord = require('discord.js');
const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents, Collection } = require('discord.js');
const { MessageEmbed } = require("discord.js");
const mongoose = require('../database/mongoose.js');
const Guild = require('../database/schemas/guildSchema.js');


const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

// Credit to the creators of MaxiGames for these lines of code that register the commands. 

client.commands = new Collection();

const commandFiles = fs
        .readdirSync(`./commands`)
        .map((file) => path.join("./commands", file))
        .filter((file) => fs.lstatSync(file).isDirectory())
        .map((dir) => fs
            .readdirSync(dir)
            .filter((file) => file.endsWith(".js"))
            .map((file) => path.join(dir, file))
        );
    console.log(commandFiles);

    const commands = [];

    for (const filecol of commandFiles) {
        for (const name of filecol) {
            const command = require(`../${name}`);
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
            console.log(`Registered ${name}.`);
        }
    }

client.events = new Collection();

require(`../handlers/eventHandler.js`)(client, Discord);





client.once('ready', async () => {

    // Activity Setting
    client.user.setActivity({name:`${client.guilds.cache.size} servers`, type: 'WATCHING'});
    console.log(`Logged in as ${client.user.tag}.`);
    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: 9
    }).setToken(process.env.BOT_TOKEN);


    // Command registration
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

    const guilds = await client.guilds.fetch();
    for(let i = 0; i < guilds.size; i++) {
        if(await Guild.exists({ _id: `${guilds.at(i).id}` }) === false) {
            const guildDoc = new Guild({
                _id: `${guilds.at(i).id}`,
                verificationType: null,
                verificationEmailDomain: null,
                verificationRole: null
            })
            guildDoc.save();
            console.log('Guild added.')
        }
    }
    
    
});

client.on("interactionCreate", async interaction => {
    if(interaction.isCommand()) {
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
    } // else if (interaction.isSelectMenu()) {
        
    //     if (interaction.customId === "helpSelectMenu") {
            
    //         console.log(commandArray)
    //         for (let i = 0; i < commandArray.length; i++) {
    //             if (commandArray[i].name === interaction.values) {
    //                 const specificHelpEmbed = new MessageEmbed()
    //                     .setColor("#9664FF")
    //                     .setTitle(`/${commandArray[i].name} Help`)
    //                     .setDescription(`${commandArray[i].desc}`)
    //                 for (let j = 0; j < commandArray[i].options.length; j++) {
    //                     specificHelpEmbed.addFields(
    //                         {name: 'test', description: 'test'}
    //                     )
    //                 }
    //             }
    //         }
    //         interaction.editReply({embeds: [specificHelpEmbed]})
    //     }
    // }
});

mongoose.init();
client.login(process.env.BOT_TOKEN);

module.exports = client;