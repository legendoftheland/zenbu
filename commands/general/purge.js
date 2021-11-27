const { SlashCommandBuilder } = require("@discordjs/builders");
const { Message } = require("discord.js");
const client = require("../../src/bot");


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
        if (interaction.member.permissions.has("MANAGE_MESSAGES") && interaction.guild.me.permissions.has("MANAGE_MESSAGES")) {
            const fetched = await interaction.channel.messages.fetch({ limit: interaction.options.getNumber("number") });
            var notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
            await interaction.channel.bulkDelete(notPinned, true);
            await interaction.reply(`Deleted ${notPinned.size} message(s) successfully. Pinned messages and messages older than 2 weeks have not been deleted.`);
            setTimeout(() => interaction.deleteReply(), 3000)
        } else if (interaction.member.permissions.has("MANAGE_MESSAGES") === false) {
            interaction.reply("You do not have the **Manage Messages** permission. Please ask a moderator to give you this permission.")
        } else {
            interaction.reply("I have not been given the relevant permissions to do this. Please contact a moderator and ask them to give me the **Manage Messages** permission.")
        }
    }
}