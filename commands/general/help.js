const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js")
const client = require("../../src/bot.js");
require('dotenv').config();
const fs = require("fs");
const path = require("path");
const { size, i } = require("mathjs");
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("help") // Command name
        .setDescription("Shows help for Zenbu commands"), // Command description
        
    async execute(interaction) {
        const commandArray = require('../../global/commandArray.js')
        const helpEmbed = new MessageEmbed()
            .setColor("#3AA1FF")
            .setTitle("Help")
            for(let i = 0; i < commandArray.length; i++) {
                helpEmbed.addFields(
                    {name: `/${commandArray[i].name}`, value: `${commandArray[i].desc}`, inline: false}
                )
            }
            helpEmbed.setFooter(`Version: ${process.env.VERSION}`);
        
        interaction.reply({
            embeds: [helpEmbed]
        });
    }
}
