const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js")
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help") // Command name
        .setDescription("Help for Zenbu commands"), // Command description
    async execute(interaction) {
        const helpEmbed = new MessageEmbed()
            .setColor("#3AA1FF")
            .setTitle("Help")
            .setAuthor("Zenbu", "https://i.imgur.com/gktrN4g.png")
            .setDescription("Get help for Zenbu commands!")
            .addFields(
                {name: "help", value: "Opens this message! Get help for Zenbu commands."},
                {name: "ping", value: "Pings the bot and shows latency."},
                {name: "purge", value: "Deletes a set number of messages (provided author has the Manage Messages permission)."}
            )
            .setFooter(`Version: ${process.env.VERSION}`);
        interaction.reply({
            embeds: [helpEmbed]
        });
    }
}