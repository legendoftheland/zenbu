const { SlashCommandBuilder } = require("@discordjs/builders");
const client = require("../../src/bot.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pings the bot and shows latency"),
    async execute(interaction) {
       interaction.reply(`Pong! Your ping is **${Math.round(interaction.client.ws.ping)}ms**.`);
    }
}

