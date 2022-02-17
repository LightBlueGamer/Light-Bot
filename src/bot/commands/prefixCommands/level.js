const { getLevel, getLevelXP } = require("../../modules/levels");
const { MessageEmbed } = require("discord.js");
const { config } = require("../../../db/index");

module.exports = {
    name: "level",
    description: "Shows your level",
    async execute(message, args) {
        const target = args[0]
            ? message.mentions.members.first() ||
              (await message.guild.members.fetch(args[0])) ||
              message.guild.members.cache.find((x) => x.displayName === args[0])
            : message.member;

        if (target.user.bot)
            return message.reply({
                content: "Bots don't have a level",
            });

        const { xp, level } = await getLevel(message.guild.id, target.id);

        const embed = new MessageEmbed()
            .setTitle(
                target.displayName.endsWith("s")
                    ? `${target.displayName}' level`
                    : `${target.displayName}'s level`
            )
            .setDescription(
                `XP: ${xp}
                Level: ${xp}
                Next lvl: ${
                    (await levels.getLevelXP(message.guild.id, target.id)) -
                    (xp)
                } xp`
            )
            .setColor(target.roles.highest.hexColor);

        return message.reply({
            embeds: [embed],
        });
    },
};
