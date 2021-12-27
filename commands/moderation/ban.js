const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js")
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const client = require("../../src/bot");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban") // Command name
        .setDescription("Ban a member")     // Command description
        .addUserOption((option) => // Adds an argument
            option 
                .setName("member") // Argument name
                .setDescription("The member to ban") // Argument description
                .setRequired(true), // Argument requirement
        )
        .addNumberOption((option) => 
            option
                .setName('days')
                .setDescription('The number of days\' worth of messages to delete')
                .setRequired(false)
        )
        .addStringOption((option) => 
            option
                .setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false)
        ),
    async execute(interaction) {
        const memberToBan = await interaction.guild.members.fetch(interaction.options.getUser('member'));
        if(!interaction.guild.me.permissions.has('BAN_MEMBERS')) {
            const failure_botInsufficientPermsEmbed = new MessageEmbed()
            .setColor("#FF5757")
            .setTitle("Zenbu has insufficient permissions")
            .setDescription("I have not been given the `Ban Members` permission, which is required for banning members. Please ask a moderator to give me this permission.")
            interaction.reply({
                embeds: [failure_botInsufficientPermsEmbed],
                ephemeral: false
            });
        } else if(!memberToBan.bannable) {
            const failure_unbannable = new MessageEmbed()
            .setColor("#FF5757")
            .setTitle("User not bannable")
            .setDescription("This user doesn't seem to be bannable. Please check that this user is bannable by Zenbu, and try again.")
            interaction.reply({
                embeds: [failure_unbannable],
                ephemeral: false
            });
        } else if(interaction.options.getNumber('days') > 7) {
            const failure_daysTooHigh = new MessageEmbed()
            .setColor("#FF5757")
            .setTitle("Day count too high")
            .setDescription("The `days` argument can only be between 0 and 7. Please set this value to something between 0 and 7 and try again.")
            interaction.reply({
                embeds: [failure_daysTooHigh],
                ephemeral: false
            });
        } else if(!interaction.member.permissions.has('BAN_MEMBERS')){
            const failure_memberInsufficientPermsEmbed = new MessageEmbed()
            .setColor("#FF5757")
            .setTitle("You have insufficient permissions")
            .setDescription("You have not been given the `Ban Members` permission, which is required for banning members. Please ask a moderator to give you this permission.")
            interaction.reply({
                embeds: [failure_memberInsufficientPermsEmbed],
                ephemeral: false
            });
        } else {
            
            const days = interaction.options.getNumber('days');
            let reason = interaction.options.getString('reason');
            if(reason === null) {
                reason = 'No reason specified'
            }
            memberToBan.ban({days: days, reason: reason});

            const successEmbed = new MessageEmbed()
            .setColor("#00E209")
            .setTitle("Success!")
            .setDescription(`${memberToBan} was banned successfully! (Reason: ${reason})`)
            interaction.reply({
                embeds: [successEmbed],
                ephemeral: false
            });
        }
    }
}