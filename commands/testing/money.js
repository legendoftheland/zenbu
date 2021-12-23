const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const User = require('../../database/schemas/userSchema.js');

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
        .setName("money") // Command name
        .setDescription("Get more money (test command)")     // Command description
        .addNumberOption((option) => // Adds an argument
            option 
                .setName("amount") // Argument name
                .setDescription("Specify the amount of money you want.") // Argument description
                .setRequired(true), // Argument requirement
        ),
    async execute(interaction) {
        const userDoc = new User({
            _id: `${interaction.user.id}`,
            money: `${interaction.options.getNumber("amount")}`
        })
        userDoc.save();
            
        interaction.reply({
            content: `You have been given ${interaction.options.getNumber("amount")} coin(s).`,
            ephemeral: false
        });

    }
}