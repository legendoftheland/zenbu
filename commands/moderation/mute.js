const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const client = require("rest/client");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute") // Command name
        .setDescription("Mutes user/puts user in timeout") // Command description
        .addUserOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("user") // Argument name
                    .setDescription("The user you want to mute/timeout") // Argument description
                    .setRequired(true) // Argument requirement
        )
        .addNumberOption((option) =>
            option.setName("minutes").setDescription("The number of minutes you want to mute/timeout the user").setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("The reason you muted this user/put this user in timeout").setRequired(false)
        ),
    async execute(interaction) {
        const memberToMute = await interaction.guild.members.fetch(interaction.options.getUser("user"));
        if (!interaction.member.permissions.has("MODERATE_MEMBERS")) {
            const failure_memberInsufficientPermsEmbed = new MessageEmbed()
                .setColor("#FF5757")
                .setTitle("You have insufficient permissions")
                .setDescription(
                    "You have not been given the `Timeout Members` permission, which is required for timing out members. Please ask a moderator to give you this permission."
                );
            interaction.reply({
                embeds: [failure_memberInsufficientPermsEmbed],
                ephemeral: false,
            });
        } else if (!interaction.guild.me.permissions.has("MODERATE_MEMBERS")) {
            const failure_botInsufficientPermsEmbed = new MessageEmbed()
                .setColor("#FF5757")
                .setTitle("Zenbu has insufficient permissions")
                .setDescription(
                    "I have not been given the `Timeout Members` permission, which is required for timing out members. Please ask a moderator to give me this permission."
                );
            interaction.reply({
                embeds: [failure_botInsufficientPermsEmbed],
                ephemeral: false,
            });
        } else if (!interaction.guild.members.fetch(interaction.options.getUser("user")).moderatable) {
            const failure_untimeoutable = new MessageEmbed()
                .setColor("#FF5757")
                .setTitle("User not timeoutable")
                .setDescription("This user doesn't seem to be timeoutable. Please check that this user is timeoutable by Zenbu, and try again.");
            interaction.reply({
                embeds: [failure_untimeoutable],
                ephemeral: false,
            });
        } else {
            let reason = interaction.options.getString("reason");
            if (reason === null) {
                reason = "No reason specified";
            }
            memberToMute.timeout(interaction.options.getNumber("minutes") * 1000 * 60, interaction.options.getString("reason"));

            const successEmbed = new MessageEmbed()
                .setColor("#00E209")
                .setTitle("Success!")
                .setDescription(`${memberToMute} was muted successfully! (Reason: ${reason})`);
            interaction.reply({
                embeds: [successEmbed],
                ephemeral: false,
            });
        }
    },
};
