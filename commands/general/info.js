const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { e } = require("mathjs");
const client = require("../../src/bot");
const { get } = require("../../src/nodemailer");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info") // Command name
        .setDescription("Get information about various things in Discord") // Command description
        .addSubcommand((subcommand) =>
            subcommand
                .setName("user")
                .setDescription("Get information about a user")
                .addUserOption(
                    (
                        option // Adds an argument
                    ) =>
                        option
                            .setName("user") // Argument name
                            .setDescription("The user to get information about (you by default)") // Argument description
                            .setRequired(false) // Argument requirement
                )
        )
        .addSubcommand((subcommand) => subcommand.setName("zenbu").setDescription("Get information about this bot"))
        .addSubcommand((subcommand) => subcommand.setName("invite").setDescription("Get information about an invite")),

    async execute(interaction) {
        // User Info
        if (interaction.options.getSubcommand() === "user") {
            let userInFocus = null;

            if (interaction.options.getUser("user") === null) {
                userInFocus = interaction.user;
            } else {
                userInFocus = interaction.options.getUser("user");
            }

            let userType = "";

            if (userInFocus.bot === false) {
                userType = "Human";
            } else {
                userType = "Bot";
            }

            let userBanner = "";
            if (userInFocus.banner === undefined) {
                userBanner = "User has no banner";
            } else {
                userBanner = `${userInFocus.banner}`;
            }

            const memberInFocus = await interaction.guild.members.fetch(userInFocus);

            let rolesList = "";
            memberInFocus.roles.cache.forEach((role) => {
                if (role.name !== "@everyone") {
                    rolesList += "<@&" + role.id + "> ";
                }
            });
            if (rolesList === "") {
                rolesList = "User has no roles";
            }

            const userInfoEmbed = new MessageEmbed()
                .setColor("#9664FF")
                .setThumbnail(`https://cdn.discordapp.com/avatars/${userInFocus.id}/${userInFocus.avatar}.jpg`)
                .setAuthor(`${userInFocus.tag}`, userInFocus.avatarURL(true))
                .setTitle(`Information about ${userInFocus.tag}`)
                .addFields(
                    {
                        name: "User ID",
                        value: `${userInFocus.id}`,
                        inline: false,
                    },
                    {
                        name: "Avatar URL",
                        value: `[Link](https://cdn.discordapp.com/avatars/${userInFocus.id}/${userInFocus.avatar}.jpg)`,
                        inline: false,
                    },
                    {
                        name: "Created At",
                        value: `<t:${Math.floor(userInFocus.createdTimestamp / 1000)}>`,
                        inline: false,
                    },
                    { name: "Type", value: `${userType}`, inline: false },
                    {
                        name: "Avatar Hash",
                        value: `${userInFocus.avatar}`,
                        inline: false,
                    },
                    {
                        name: "Banner Hash",
                        value: `${userBanner}`,
                        inline: false,
                    },

                    {
                        name: "Display Color",
                        value: `${memberInFocus.displayHexColor}`,
                        inline: false,
                    },
                    {
                        name: "Display Name",
                        value: `${memberInFocus.displayName}`,
                        inline: false,
                    },
                    {
                        name: "Joined At",
                        value: `<t:${Math.floor(memberInFocus.joinedTimestamp / 1000)}>`,
                        inline: false,
                    },
                    { name: "Roles", value: `${rolesList}`, inline: false }
                );
            interaction.reply({
                embeds: [userInfoEmbed],
                ephemeral: false,
            });
        }

        // Bot Info
        else if (interaction.options.getSubcommand() === "zenbu") {
            const client = require("../../src/bot.js");
            let userInFocus = client.user;
            let uptimeH = Math.floor(client.uptime / 3600000);
            let uptimeMin = Math.round((client.uptime % 3600000) / 60000);
            const zenbuInfoEmbed = new MessageEmbed()
                .setColor("#9664FF")
                .setThumbnail(`https://cdn.discordapp.com/avatars/${userInFocus.id}/${userInFocus.avatar}.jpg`)
                .setAuthor(`${userInFocus.tag}`, userInFocus.avatarURL(true))
                .setTitle(`Information about ${userInFocus.tag}`)
                .addFields(
                    {
                        name: "User ID",
                        value: `${userInFocus.id}`,
                        inline: false,
                    },
                    {
                        name: "Avatar URL",
                        value: `[Link](https://cdn.discordapp.com/avatars/${userInFocus.id}/${userInFocus.avatar}.jpg)`,
                        inline: true,
                    },
                    {
                        name: "Last Ready",
                        value: `<t:${Math.floor(client.readyTimestamp / 1000)}:R>`,
                        inline: true,
                    },
                    {
                        name: "Library",
                        value: `[discord.js](https://discord.js.org/)`,
                        inline: true,
                    },
                    {
                        name: "GitHub Repository",
                        value: `[legendoftheland/zenbu](https://github.com/legendoftheland/zenbu)`,
                        inline: true,
                    }
                );
            interaction.reply({
                embeds: [zenbuInfoEmbed],
                ephemeral: false,
            });
        }

        // Invite Info
        else if (interaction.options.getSubcommand() === "invite") {
        }
    },
};
