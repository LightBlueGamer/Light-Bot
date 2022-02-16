const levels = require("../../modules/levels");
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

        if (!(await levels.hasAccount(message.guild.id, target.id)))
            await levels.setup(message.guild.id, target.id);

        const embed = new MessageEmbed()
            .setTitle(
                target.displayName.endsWith("s")
                    ? `${target.displayName}' level`
                    : `${target.displayName}'s level`
            )
            .setDescription(
                `XP: ${await levels.getXp(message.guild.id, target.id)}
                Level: ${await levels.getLvl(message.guild.id, target.id)}
                Next lvl: ${
                    (await levels.getLevelXP(message.guild.id, target.id)) -
                    (await levels.getXp(message.guild.id, target.id))
                } xp`
            )
            .setColor(target.roles.highest.hexColor);

        return message.reply({
            embeds: [embed],
        });
    },
};
