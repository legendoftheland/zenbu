const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("error") // Command name
        .setDescription("Throws an error manually (test command)"),     // Command description
      
    async execute(interaction) {
        throw "ERROR THROWN: This error was thrown manually via the /error command.";
    }
}