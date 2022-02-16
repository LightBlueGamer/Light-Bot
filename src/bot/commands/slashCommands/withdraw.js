const { SlashCommandBuilder } = require("@discordjs/builders");
const economy = require("../../modules/economy");
const { MessageEmbed } = require("discord.js");
const { config } = require("../../../db/index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("withdraw")
        .setDescription("Withdraw money from your bank")
        .addNumberOption((option) =>
            option.setName("amount").setDescription("Amount of money to withdraw").setRequired(true)
        )
        .toJSON(),
    async execute(interaction) {
        const amount = interaction.options.getNumber("amount");
        await economy.withdraw(interaction.guild.id, interaction.user.id, amount);
        const currency = await config.get(`${interaction.guild.id}.economy.currency`);
        const embed = new MessageEmbed()
            .setTitle(
                interaction.member.displayName.endsWith("s")
                    ? `${interaction.member.displayName}' balance`
                    : `${interaction.member.displayName}'s balance`
            )
            .setDescription(
                `Wallet: ${currency.replace(
                    "{balance}",
                    await economy.getBalance(interaction.guild.id, interaction.user.id)
                )}
                Bank: ${currency.replace(
                    "{balance}",
                    await economy.getBank(interaction.guild.id, interaction.user.id)
                )}`
            )
            .setColor(interaction.member.roles.highest.hexColor);

        return interaction.reply({
            embeds: [embed],
        });
    },
};
