const Guild = require('../../database/schemas/guildSchema.js');

module.exports = (client, Discord, guild) => {
    const guildDoc = new Guild({
        _id: `${guild.id}`,
        verificationType: null,
        verificationEmailDomain: null
    })
    guildDoc.save();
}