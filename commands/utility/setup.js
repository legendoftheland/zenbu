const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js")

// EMBEDS
const sampleEmbed = new MessageEmbed()
            .setColor("#3AA1FF")
            .setTitle("Title")
            .setDescription("Description")
            .addFields(
                {name: "Field1", value: "Value1", inline: false},
            )

module.exports = {
    data: new SlashCommandBuilder()
        .setName("name") // Command name
        .setDescription("description")     // Command description
        .addStringOption((option) => // Adds an argument
            option 
                .setName("name") // Argument name
                .setDescription("description") // Argument description
                .setRequired(true), // Argument requirement
        ),
    async execute(interaction) {
        interaction.reply({
            content: interaction.options.getString("name"),
            ephemeral: false
        });
    }
}