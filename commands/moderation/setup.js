const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const client = require("../../src/bot");
const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup") // Command name
        .setDescription("Set up various commands and modules in Zenbu") // Command description
        .addStringOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("command") // Argument name
                    .setDescription("The command to set up") // Argument description
                    .setRequired(true)
                    .addChoice("verify", "verify") // Argument requirement
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            const failure_memberInsufficientPermsEmbed = new MessageEmbed()
                .setColor("#FF5757")
                .setTitle("You have insufficient permissions")
                .setDescription(
                    "You have not been given the `Administrator` permission - this command can only be used by server administrators. Please ask a server administrator to give you this permission."
                );

            interaction.reply({
                embeds: [failure_memberInsufficientPermsEmbed],
                ephemeral: false,
            });
        } else if (interaction.options.getString("command") === "verify") {
            if (!interaction.guild.me.permissions.has("MANAGE_ROLES")) {
                const failure_memberInsufficientPermsEmbed = new MessageEmbed()
                    .setColor("#FF5757")
                    .setTitle("Zenbu has insufficient permissions")
                    .setDescription(
                        "I have not been given the `Manage Roles` permission, which is required for verification. Please ask a moderator to give me this permission."
                    );

                interaction.reply({
                    embeds: [failure_memberInsufficientPermsEmbed],
                    ephemeral: false,
                });
            } else {
                const setup_typeRow = new MessageActionRow().addComponents(
                    new MessageButton().setCustomId("setup_email").setLabel("E-mail 📧").setStyle("PRIMARY"),
                    new MessageButton().setCustomId("setup_captcha").setLabel("Captcha 🤖").setStyle("PRIMARY")
                );
                const setup_stepOne_Type = new MessageEmbed()
                    .setColor("#FFC149")
                    .setTitle("Step 1: Set verification type")
                    .setDescription("Select one type of verification for this server by clicking one of the buttons below.");

                interaction.reply({
                    embeds: [setup_stepOne_Type],
                    components: [setup_typeRow],
                });
            }
        }
    },
};
