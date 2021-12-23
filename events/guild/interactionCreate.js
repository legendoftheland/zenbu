const Guild = require("../../database/schemas/guildSchema.js");
const { MessageEmbed } = require("discord.js");
const {
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
} = require("discord.js");

module.exports = async (client, Discord, interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "setup_email") {
      Guild.findByIdAndUpdate(
        interaction.guild.id,
        { verificationType: "email" },
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );

      const setup_stepTwoAlpha_Domain = new MessageEmbed()
        .setColor("#FFC149")
        .setTitle("Step 2: Set e-mail domain")
        .setDescription(
          "Send an e-mail domain for the bot to verify based on. For example, if you set `gmail.com` as the domain, Zenbu will only send verification codes to users who input an e-mail address with the domain `gmail.com`. You can set no domain by sending Zenbu the word `none`."
        );

      interaction.update({ embeds: [setup_stepTwoAlpha_Domain] });
    } else if (interaction.customId === "setup_captcha") {
      Guild.findByIdAndUpdate(
        interaction.guild.id,
        { verificationType: "captcha" },
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );

      let setup_roleRowOptions = [];
      const guildRoles = await interaction.guild.roles.fetch();
      const guildRolesFiltered = guildRoles.filter(
        (role) => role.name !== "@everyone" && !role.managed
      );

      if (guildRolesFiltered.size === 0) {
        const setup_failure_noRoles = new MessageEmbed()
          .setColor("#FF5757")
          .setTitle("No non-bot roles")
          .setDescription(
            "There are no non-bot-integration roles in your server. A verification role is necessary for verification. Please create one and try again."
          );

        interaction.update({
          embeds: [setup_failure_noRoles],
          components: [],
          content: null,
        });
        return;
      }

      for (let i = 0; i < guildRolesFiltered.size; i++) {
        setup_roleRowOptions.push({
          label: `@${guildRolesFiltered.at(i).name}`,
          value: `${guildRolesFiltered.at(i).id}`,
        });
      }
      console.log(setup_roleRowOptions);
      console.log(guildRolesFiltered);

      const setup_roleRow = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("setup_verifyRole")
          .setPlaceholder("Select a role")
          .addOptions(setup_roleRowOptions)
      );

      const setup_stepTwoBeta_Role = new MessageEmbed()
        .setColor("#FFC149")
        .setTitle("Step 2: Select role")
        .setDescription(
          "Select a role from the dropdown below to set as your verified role. Please ensure that this verified role does not have the same permissions as `@everyone`."
        );

      interaction.update({
        embeds: [setup_stepTwoBeta_Role],
        components: [setup_roleRow],
      });
    }
  } else if (interaction.isSelectMenu()) {
    if (interaction.customId === "setup_verifyRole") {
      Guild.findByIdAndUpdate(
        interaction.guild.id,
        { verificationRole: `${interaction.values[0]}` },
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );

      const setup_stepTwoBeta_Role = new MessageEmbed()
        .setColor("#00E209")
        .setTitle("Verification set up")
        .setDescription(
          "The verification system for your server has been successfully set up!"
        );

      interaction.update({
        embeds: [setup_stepTwoBeta_Role],
        content: null,
        components: [],
      });
    }
  }
};
