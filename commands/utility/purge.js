const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js")
const { Message } = require("discord.js");
const client = require("../../src/bot.js");

// EMBEDS


module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge") // Command name
        .setDescription("Deletes a set number of messages (max 100)") // Command description
        .addNumberOption((option) => // Adds an argument
            option 
                .setName("number") // Argument name
                .setDescription("Sets the number of messages to delete (max 100)") // Argument description
                .setRequired(true), // Argument requirement
        ),
    async execute(interaction) {
        if (interaction.member.permissions.has("MANAGE_MESSAGES") && interaction.guild.me.permissions.has("MANAGE_MESSAGES")) {
            if (interaction.options.getNumber('number') > 100) {
                const failure_TooManyMessagesEmbed = new MessageEmbed()
                    .setColor('#FF5757')
                    .setTitle('Too many messages')
                    .setDescription('Only a maximum of 100 messages can be deleted with the /purge command. Please try again later.')
                await interaction.reply({embeds: [failure_TooManyMessagesEmbed]});
            } else {
                const fetched = await interaction.channel.messages.fetch({ limit: interaction.options.getNumber("number") });
                var notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
                await interaction.channel.bulkDelete(notPinned, true);

                // Success Message Embed
                const successEmbed = new MessageEmbed()
                    .setColor("#00E209")
                    .setTitle("Success!")
                    .setDescription(`Deleted ${notPinned.size} message(s) successfully. Pinned messages and messages older than 2 weeks have not been deleted.`);
                    
                await interaction.reply({embeds: [successEmbed]});
                setTimeout(() => interaction.deleteReply(), 3000)
            }
        } else if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {

            // Member Insuffcient Perms Msg
            const failure_memberInsufficientPermsEmbed = new MessageEmbed()
                .setColor("#FF5757")
                .setTitle("You have insufficient permissions")
                .setDescription("You have not been given the `Manage Messages` permission, which is required for message deletion. Please ask a moderator to give you this permission.");

            interaction.reply({embeds: [failure_memberInsufficientPermsEmbed]});
        } else if(!interaction.guild.me.permissions.has('MANAGE_MESSAGES')) {

            // Member Insuffcient Perms Msg
            const failure_botInsufficientPermsEmbed = new MessageEmbed()
                .setColor("#FF5757")
                .setTitle("Zenbu has insufficient permissions")
                .setDescription("I have not been given the `Manage Messages` permission, which is required for message deletion. Please ask a moderator to give me this permission.");

            interaction.reply({embeds: [failure_botInsufficientPermsEmbed]});
        }
    }
}