const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const fetch = require("node-fetch");

// EMBEDS
const sampleEmbed = new MessageEmbed()
    .setColor("#3AA1FF")
    .setTitle("Title")
    .setDescription("Description")
    .addFields({ name: "Field1", value: "Value1", inline: false });

module.exports = {
    data: new SlashCommandBuilder()
        .setName("news") // Command name
        .setDescription("Fetch the news for any topic, in any country. Brought to you by NewsAPI.org.") // Command description
        .addStringOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("query") // Argument name
                    .setDescription("The topic you want to search for.") // Argument description
                    .setRequired(true) // Argument requirement
        )
        .addIntegerOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("results") // Argument name
                    .setDescription("The number of results you want returned. Default 5, maximum 10.") // Argument description
                    .setRequired(false) // Argument requirement
        )
        .addStringOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("language") // Argument name
                    .setDescription("The topic you want to search for.") // Argument description
                    .setRequired(false) // Argument requirement
                    .addChoice("English (EN)", "en")
                    .addChoice("Arabic (AR)", "ar")
                    .addChoice("German (DE)", "de")
                    .addChoice("Spanish (ES)", "es")
                    .addChoice("French (FR)", "fr")
                    .addChoice("Hebrew (HE)", "he")
                    .addChoice("Italian (IT)", "it")
                    .addChoice("Dutch (NL)", "nl")
                    .addChoice("Norwegian (NO)", "no")
                    .addChoice("Portuguese (PT)", "pt")
                    .addChoice("Russian (RU)", "ru")
                    .addChoice("Chinese (ZH)", "zh")
        )
        .addStringOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("domains") // Argument name
                    .setDescription("Domains/websites you want to restrict the search to, separated by commas.") // Argument description
                    .setRequired(false) // Argument requirement
        )
        .addStringOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("excludedomains") // Argument name
                    .setDescription("Domains/websites you want to exclude from the search, separated by commas.") // Argument description
                    .setRequired(false) // Argument requirement
        )
        .addStringOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("searchin") // Argument name
                    .setDescription("The fields you want your query search to be restricted to.") // Argument description
                    .setRequired(false) // Argument requirement
                    .addChoice("title", "title")
                    .addChoice("description", "description")
                    .addChoice("content", "content")
        )
        .addStringOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("from") // Argument name
                    .setDescription("The date (optional time) for the oldest article allowed. Must be in YYYY-MM-DD format.") // Argument description
                    .setRequired(false) // Argument requirement
        )
        .addStringOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("to") // Argument name
                    .setDescription("The date (optional time) for the new article allowed. Must be in YYYY-MM-DD format.") // Argument description
                    .setRequired(false) // Argument requirement
        )
        .addStringOption(
            (
                option // Adds an argument
            ) =>
                option
                    .setName("sort") // Argument name
                    .setDescription("How the content should be sorted. Default is Newest First.") // Argument description
                    .setRequired(false) // Argument requirement
                    .addChoice("newest first", "publishedAt")
                    .addChoice("relevant first", "relevancy")
                    .addChoice("popular first", "popularity")
        ),

    async execute(interaction) {
        let domains = "";
        let excludedomains = "";
        let language = "";
        let searchin = "";
        if (interaction.options.getString("domains") === null) {
            domains = "";
        } else {
            domains = interaction.options.getString("domains");
        }
        if (interaction.options.getString("excludedomains") === null) {
            excludedomains = "";
        } else {
            excludedomains = interaction.options.getString("excludedomains");
        }
        if (interaction.options.getString("language") === null) {
            language = "";
        } else {
            language = interaction.options.getString("language");
        }
        if (interaction.options.getString("searchin") === null) {
            searchin = "";
        } else {
            searchin = interaction.options.getString("searchin");
        }
        let resultsInPage = 5;
        if (interaction.options.getInteger("results") !== null && interaction.options.getInteger("results") <= 10) {
            resultsInPage = interaction.options.getInteger("results");
        } else if (interaction.options.getInteger("results") > 10) {
            resultsInPage = 10;
        }
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            interaction.options.getString("query")
        )}&searchIn=${searchin}&domains=${domains}&excludeDomains=${excludedomains}&from=${interaction.options.getString(
            "from"
        )}&to=${interaction.options.getString("to")}&language=${language}&sortBy=${interaction.options.getString(
            "sort"
        )}&pageSize=${resultsInPage}&apiKey=${process.env.NEWS_APIKEY}`;
        const urlFetch = await fetch(url);
        let newsJSON = await urlFetch.json();
        console.log(url);
        if (newsJSON.status === "ok" && newsJSON.articles.length > 0) {
            let fieldArray = [];

            for (let i = 0; i < resultsInPage; i++) {
                fieldArray.push({
                    name: `${newsJSON.articles[i].title}`,
                    value: `(from [${newsJSON.articles[i].source.name}](${newsJSON.articles[i].url})) ${newsJSON.articles[i].description}`,
                    inline: false,
                });
            }
            // EMBEDS
            const newsEmbed = new MessageEmbed()
                .setColor("#3AA1FF")
                .setTitle(`News about ${interaction.options.getString("query")} (showing top ${resultsInPage} results)`)
                .setThumbnail(`${newsJSON.articles[0].urlToImage}`)
                .addFields(fieldArray)
                .setFooter(`Powered by newsapi.org. Showing ${resultsInPage} of ${newsJSON.totalResults} results.`);
            interaction.reply({
                embeds: [newsEmbed],
                ephemeral: false,
            });
        } else {
            const errorEmbed = new MessageEmbed()
                .setColor("#FF5757")
                .setTitle(`News could not be fetched`)
                .setDescription(`Here is the error message provided: \n \`\`\`${newsJSON.message}\`\`\``)
                .setFooter(`Powered by newsapi.org.`);
            interaction.reply({
                embeds: [errorEmbed],
                ephemeral: false,
            });
        }
    },
};
