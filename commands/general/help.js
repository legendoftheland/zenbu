const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js")
const client = require("../../src/bot.js");
require('dotenv').config();
const fs = require("fs");
const path = require("path");
const { size } = require("mathjs");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("help") // Command name
        .setDescription("Help for Zenbu commands"), // Command description
    async execute(interaction) {

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

        class commandClass {
            constructor(name, desc) {
                this.name = name;
                this.desc = desc;
            }
        }

        const commandArray = [];
        for (const filecol of commandFiles) {
            for (const name of filecol) {
                const command = require(`../../${name}`);
                let commandInFocus = new commandClass(command.data.name, command.data.description)
                commandArray.push(commandInFocus);
                console.log(`Registered ${name} for /help.`);
            }
        }


        const helpEmbed = new MessageEmbed()
            .setColor("#3AA1FF")
            .setTitle("Help")
            .setDescription("Get help for Zenbu commands!")
            for(let i = 0; i < commandArray.length; i++) {
                helpEmbed.addFields(
                    {name: `${commandArray[i].name}`, value: `${commandArray[i].desc}`, inline: false}
                )
            }
            helpEmbed.setFooter(`Version: ${process.env.VERSION}`);
        interaction.reply({
            embeds: [helpEmbed]
        });
    }
}