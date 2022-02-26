const { SlashCommandBuilder } = require("@discordjs/builders");
const client = require("../../src/bot.js");
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pings the bot and shows latency"),
    async execute(interaction) {
        // EMBEDS
        const pingEmbed = new MessageEmbed()
            .setColor("#00E209")
            .setTitle("Pong!")
            .setDescription(`Your ping is **${Math.round(interaction.client.ws.ping)}ms**.`)

       interaction.reply({embeds: [pingEmbed]});
    }
}

