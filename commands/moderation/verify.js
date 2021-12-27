const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Message } = require("discord.js");
require("dotenv").config();
const transporter = require("../../src/nodemailer.js");
const { randomInt } = require("mathjs");
const client = require("../../src/bot.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify") // Command name
        .setDescription('Verify yourself (Must be set up via the "/setup verify" command by server admins)') // Command description
        .addStringOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("email") // Argument name
                    .setDescription("Your email address. A specific domain may be required, depending on server settings.") // Argument description
                    .setRequired(true) // Argument requirement
        ),
    async execute(interaction) {
        const verificationCode = randomInt(100000, 999999);
        var mailOptions = {
            from: `${interaction.guild.name} <zenbudiscordbot@gmail.com>`,
            to: `${interaction.options.getString("email")}`,
            subject: `Verification code for ${interaction.guild.name}: ${verificationCode}`,
            text: `Your verification code for ${interaction.guild.name} is ${verificationCode}. Please DM this to Zenbu. If you are not ${interaction.member.user.tag}, and/or did not request this code with /verify, you can safely ignore this email.`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        var domain = interaction.options.getString("email").split("@")[1];

        // if (domain === )
        // EMBEDS
        const confirmationEmbed = new MessageEmbed()
            .setColor("#FFC149")
            .setTitle("Verification code sent")
            .setDescription(
                `A verification code has been sent to your email, **${interaction.options.getString(
                    "email"
                )}**. Please check your mailbox and send the code back to me here.`
            );

        interaction.reply({
            embeds: [confirmationEmbed],
            ephemeral: false,
        });
    },
};
