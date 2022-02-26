const Guild = require("../../database/schemas/guildSchema.js");
const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");

module.exports = async (client, Discord, interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "verify_1") {
        }
    }
};
