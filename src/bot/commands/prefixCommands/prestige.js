const { getLevel, prestige } = require("../../modules/levels");
const { MessageEmbed } = require("discord.js");
const { config } = require("../../../db/index");

module.exports = {
    name: "prestige",
    description: "Prestige and reset your level to 0!",
    async execute(message, args) {
        const { xp, level, prestige } = await getLevel(message.guild.id, message.member.id);
        if(!level < 100) {
            return message.reply({
                content: `You are not strong enough to prestige yet.`
            })
        } else if(args[0] === 'confirm' && level >= 100) {
            await prestige(message.guild.id, message.author.id);
            message.reply({
                content: `You have prestiged to prestige level ${prestige+1}!`
            });
        } else {
            const prefix = await config.get(`${message.guild.id}.prefix`);
            message.reply({
                content: `Are you sure you wish to prestige?\nThis will reset you from level 0 but you will gain a 5% boost to experience gain from all sources.\nType\`${prefix}prestige confirm\` to prestige, this cannot be undone!`
            });
        } 
    },
};
