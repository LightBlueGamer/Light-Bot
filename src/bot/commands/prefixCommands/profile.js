const { MessageEmbed } = require("discord.js");
const { config } = require("../../../db/index");
const { getBalance } = require("../../modules/economy.js");
const { getLevel } = require("../../modules/levels.js");

module.exports = {
    name: "profile",
    description: "Shows a users profile",
    async execute(message, args) {
        const member = args[0]
            ? message.mentions.members.first() ||
              (await message.guild.members.fetch(args[0])) ||
              message.guild.members.cache.find((x) => x.displayName === args[0])
            : message.member;

        if (target.user.bot)
            return message.reply({
                content: "Bots don't have a profile",
            });

        const currency = await config.get(`${message.guild.id}.economy.currency`);
        let { balance, bank } = await getBalance(message.guild.id, target.id);

        balance = currency.replace("{balance}", balance);
        bank = currency.replace("{balance}", bank);

        const { xp, level } = await getBalance(message.guild.id, target.id);

        const embed = new MessageEmbed()
        .setTitle(member.nickname ? `${member.user.tag} AkA ${member.nickname}` : member.user.tag)
        .setDescription(`Balance: ${balance}\nBank: ${bank}\nLevel: ${level}\nXp: ${xp}`)
        .setFooter(member.id)
        .setColor(member.roles.highest.hexColor)

        message.reply({
            embeds: [embed]
        });
    },
};