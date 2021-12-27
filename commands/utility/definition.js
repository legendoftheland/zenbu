const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("definition") // Command name
        .setDescription("Search up a word in the dictionary (definitions via dictionaryapi.dev)") // Command description
        .addStringOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("word") // Argument name
                    .setDescription("The word you want the definition for") // Argument description
                    .setRequired(true) // Argument requirement
        )
        .addStringOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("language") // Argument name
                    .setDescription("The language the word is in (default English)") // Argument description
                    .setRequired(false) // Argument requirement
                    .addChoice("English", "en")
                    .addChoice("Japanese", "jp")
        ),
    async execute(interaction) {
        if (interaction.options.getString("word").toUpperCase() === "WAR IN BA SING SE") {
            const failure_noWarEmbed = new MessageEmbed()
                .setColor("#FF5757")
                .setTitle(`THERE IS NO WAR IN BA SING SE`)
                .setDescription("THERE IS NO WAR IN BA SING SE")
                .setFooter("Powered by easter eggs");

            await interaction.reply({
                embeds: [failure_noWarEmbed],
                ephemeral: false,
            });
            return;
        }
        if (interaction.options.getString("language") === "en" || interaction.options.getString("language") === null) {
            await interaction.deferReply();
            const urlFetch = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${interaction.options.getString("word")}`);
            let definitionJSON = await urlFetch.json();
            if (definitionJSON.title === "No Definitions Found") {
                const failure_noDefinitionEmbed = new MessageEmbed()
                    .setColor("#FF5757")
                    .setTitle(`No definitions found for '${interaction.options.getString("word")}'`)
                    .setDescription("There are no definitions for this word in this dictionary. Try checking the spelling, or use the web instead.")
                    .setFooter("Powered by dictionaryapi.dev");

                await interaction.editReply({
                    embeds: [failure_noDefinitionEmbed],
                    ephemeral: false,
                });
                return;
            }
            const definition = definitionJSON[0];
            let etymString = "";
            if (definition.origin === undefined) {
                etymString = "No etymology provided";
            } else {
                etymString = `${definition.origin}`;
            }
            const phoneticAndEtymFieldArray = [
                {
                    name: "Pronunciation",
                    value: `[${definition.phonetics[0].text}](https:${definition.phonetics[0].audio})`,
                    inline: false,
                },
                {
                    name: "Etymology",
                    value: `${etymString}`,
                    inline: false,
                },
            ];

            let meaningsFieldArray = [];
            for (var i = 0; i < definition.meanings.length; i++) {
                let definitionsString = "";
                for (var j = 0; j < definition.meanings[i].definitions.length; j++) {
                    let exampleString = "";
                    if (definition.meanings[i].definitions[j].example === undefined) {
                        exampleString = "";
                    } else {
                        exampleString = `\n>  *${definition.meanings[i].definitions[j].example}*`;
                    }
                    definitionsString += `**${j + 1}** ・ ${definition.meanings[i].definitions[j].definition} ${exampleString} \n`;
                }
                meaningsFieldArray.push({
                    name: `*${definition.meanings[i].partOfSpeech}*`,
                    value: `${definitionsString}`,
                    inline: false,
                });
            }

            definitionFieldArray = phoneticAndEtymFieldArray.concat(meaningsFieldArray);

            // EMBEDS
            const definitionEmbed = new MessageEmbed()
                .setColor("#9664FF")
                .setTitle(`Definition of '${definition.word}'`)
                .setFooter("Powered by dictionaryapi.dev")
                .addFields(definitionFieldArray);

            await interaction.editReply({
                embeds: [definitionEmbed],
                ephemeral: false,
            });
        } else if (interaction.options.getString("language") === "jp") {
            await interaction.deferReply();
            const urlFetch = await fetch(
                `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(interaction.options.getString("word"))}`
            );
            let definitionJSON = await urlFetch.json();
            let definition = definitionJSON.data[0];
            let wordArray = [];
            for (let i = 0; i < definition.japanese.length; i++) {
                if (definition.japanese[i].word === undefined) {
                    wordArray.push(`${definition.japanese[i].reading}`);
                } else if (definition.japanese[i].reading === undefined) {
                    wordArray.push(`${definition.japanese[i].word}`);
                } else {
                    wordArray.push(`${definition.japanese[i].word} (${definition.japanese[i].reading})`);
                }
            }
            let wanikaniString = "";
            let jlptString = "";
            if (definition.tags[0] !== undefined) {
                wanikaniString = `Level ${definition.tags[0].replace("wanikani", "")}`;
            } else {
                wanikaniString = "No WaniKani Level";
            }

            if (definition.jlpt[0] !== undefined) {
                jlptString = `${definition.jlpt[0].replace("jlpt-", "").toUpperCase()}`;
            } else {
                jlptString = "No JLPT Level";
            }

            const definitionEmbed = new MessageEmbed()
                .setColor("#9664FF")
                .setTitle(`Definition of 「${definition.slug}」`)
                .setFooter("Powered by jisho.org (only first result displayed)")
                .addFields([
                    {
                        name: "Forms",
                        value: `${wordArray.join("・")}`,
                        inline: false,
                    },
                    {
                        name: "WaniKani Level",
                        value: `${wanikaniString}`,
                        inline: true,
                    },
                    {
                        name: "JLPT Level",
                        value: `${jlptString}`,
                        inline: true,
                    },
                    {
                        name: "Parts of Speech",
                        value: `${definition.senses[0].parts_of_speech.join(", ")}`,
                        inline: true,
                    },
                    {
                        name: "English Definitions",
                        value: `${definition.senses[0].english_definitions.join("; ")}`,
                        inline: false,
                    },
                ]);

            await interaction.editReply({ embeds: [definitionEmbed] });
        }
    },
};
