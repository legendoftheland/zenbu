const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js")
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const client = require("../../src/bot");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick") // Command name
        .setDescription("Kick a member")     // Command description
        .addUserOption((option) => // Adds an argument
            option 
                .setName("member") // Argument name
                .setDescription("The member to kick") // Argument description
                .setRequired(true), // Argument requirement
        )
        .addStringOption((option) => 
            option
                .setName('reason')
                .setDescription('The reason for the kick')
                .setRequired(false)
        ),
    async execute(interaction) {
        const memberToKick = await interaction.guild.members.fetch(interaction.options.getUser('member'));
        if(!interaction.guild.me.permissions.has('KICK_MEMBERS')) {
            const failure_botInsufficientPermsEmbed = new MessageEmbed()
            .setColor("#FF5757")
            .setTitle("Zenbu has insufficient permissions")
            .setDescription("I have not been given the `Kick Members` permission, which is required for kicking members. Please ask a moderator to give me this permission.")
            interaction.reply({
                embeds: [failure_botInsufficientPermsEmbed],
                ephemeral: false
            });
        } else if(!memberToKick.kickable) {
            const failure_unkickable = new MessageEmbed()
            .setColor("#FF5757")
            .setTitle("User not kickable")
            .setDescription("This user doesn't seem to be kickable. Please check that this user is kickable by Zenbu, and try again.")
            interaction.reply({
                embeds: [failure_unkickable],
                ephemeral: false
            });
        } else if(!interaction.member.permissions.has('KICK_MEMBERS')){
            const failure_memberInsufficientPermsEmbed = new MessageEmbed()
            .setColor("#FF5757")
            .setTitle("You have insufficient permissions")
            .setDescription("You have not been given the `Kick Members` permission, which is required for kicking members. Please ask a moderator to give you this permission.")
            interaction.reply({
                embeds: [failure_memberInsufficientPermsEmbed],
                ephemeral: false
            });
        } else {
            let reason = interaction.options.getString('reason');
            if(reason === null) {
                reason = 'No reason specified'
            }

            memberToKick.kick(reason);

            const successEmbed = new MessageEmbed()
            .setColor("#00E209")
            .setTitle("Success!")
            .setDescription(`${memberToKick} was kicked successfully! (Reason: ${reason})`)
            interaction.reply({
                embeds: [successEmbed],
                ephemeral: false
            });
        }
    }
}