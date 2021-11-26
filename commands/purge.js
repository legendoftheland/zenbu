const { SlashCommandBuilder } = require("@discordjs/builders");
const { Message } = require("discord.js");

const toPurge = [];
module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge") // Command name
        .setDescription("Deletes a set number of messages") // Command description
        .addNumberOption((option) => // Adds an argument
            option 
                .setName("number") // Argument name
                .setDescription("Sets the number of messages to delete") // Argument description
                .setRequired(true), // Argument requirement
        ),
    async execute(interaction) {
        if (interaction.member.permissions.has("MANAGE_MESSAGES")) {
            interaction.channel.bulkDelete(interaction.options.getNumber("number"));
            const msg = interaction.reply(`Deleted ${interaction.options.getNumber("number")} messages successfully.`);
            msg.delete();
        } else {
            interaction.reply("You do not have the **Manage Messages** permission. Please ask a moderator to give you this permission.")
        }
    }
}