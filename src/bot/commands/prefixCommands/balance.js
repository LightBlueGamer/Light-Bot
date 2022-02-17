const { MessageEmbed } = require("discord.js");
const { config } = require("../../../db/index");
const { getBalance } = require("../../modules/economy.js")

module.exports = {
    name: "balance",
    description: "Shows balance of a user",
    async execute(message, args) {
        const target = args[0]
            ? message.mentions.members.first() ||
              (await message.guild.members.fetch(args[0])) ||
              message.guild.members.cache.find((x) => x.displayName === args[0])
            : message.member;

        if (target.user.bot)
            return message.reply({
                content: "Bots don't have a balance",
            });

        const { balance, bank } = await getBalance(message.guild.id, target.id);

        const currency = await config.get(`${message.guild.id}.economy.currency`);
        const embed = new MessageEmbed()
            .setTitle(
                target.displayName.endsWith("s")
                    ? `${target.displayName}' balance`
                    : `${target.displayName}'s balance`
            )
            .setDescription(
                `Wallet: ${currency.replace("{balance}", balance)}
                Bank: ${currency.replace("{balance}", bank)}`
            )
            .setColor(target.roles.highest.hexColor);

        return message.reply({
            embeds: [embed],
        });
    },
};
