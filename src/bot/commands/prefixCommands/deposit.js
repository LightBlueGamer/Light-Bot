const economy = require("../../modules/economy");
const { MessageEmbed } = require("discord.js");
const { config } = require("../../../db/index");

module.exports = {
    name: "deposit",
    description: "Deposit money to your bank",
    async execute(message, args) {
        const amount = args[0];
        if (!amount)
            return message.reply({
                content: "You must give a amount to deposit",
            });
        if (amount < 0)
            return message.reply({
                content: "You must give a number higher than 0 to deposit",
            });

        await economy.deposit(message.guild.id, message.author.id, amount);
        const currency = await config.get(`${message.guild.id}.economy.currency`);
        const embed = new MessageEmbed()
            .setTitle(
                message.member.displayName.endsWith("s")
                    ? `${message.member.displayName}' balance`
                    : `${message.member.displayName}'s balance`
            )
            .setDescription(
                `Wallet: ${currency.replace(
                    "{balance}",
                    await economy.getBalance(message.guild.id, message.author.id)
                )}
                Bank: ${currency.replace(
                    "{balance}",
                    await economy.getBank(message.guild.id, message.author.id)
                )}`
            )
            .setColor(message.member.roles.highest.hexColor);

        return message.reply({
            embeds: [embed],
        });
    },
};
