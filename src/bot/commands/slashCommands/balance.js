const { SlashCommandBuilder } = require("@discordjs/builders");
const economy = require("../../modules/economy");
const { MessageEmbed } = require("discord.js");
const { config } = require("../../../db/index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Shows your balance")
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("Member to show balance of, leave empty for yourself")
        )
        .toJSON(),
    async execute(interaction) {
        const member = interaction.options.getMember("member") || interaction.member;

        if (member.user.bot)
            return interaction.reply({
                content: "Bots don't have a balance",
            });

        if (!(await economy.hasAccount(interaction.guild.id, member.id)))
            await economy.setup(interaction.guild.id, member.id);

        const currency = await config.get(`${interaction.guild.id}.economy.currency`);
        const embed = new MessageEmbed()
            .setTitle(
                member.displayName.endsWith("s")
                    ? `${member.displayName}' balance`
                    : `${member.displayName}'s balance`
            )
            .setDescription(
                `Wallet: ${currency.replace(
                    "{balance}",
                    await economy.getBalance(interaction.guild.id, member.id)
                )}
                Bank: ${currency.replace(
                    "{balance}",
                    await economy.getBank(interaction.guild.id, member.id)
                )}`
            )
            .setColor(member.roles.highest.hexColor);

        return interaction.reply({
            embeds: [embed],
        });
    },
};
