const { SlashCommandBuilder } = require("@discordjs/builders");
const { getLevel, getLevelXP } = require("../../modules/economy");
const { MessageEmbed } = require("discord.js");
const { config } = require("../../../db/index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("level")
        .setDescription("Shows level of a user")
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("Member to show level of, leave empty for yourself")
        )
        .toJSON(),
    async execute(interaction) {
        const member = interaction.options.getMember("member") || interaction.member;

        if (member.user.bot)
            return interaction.reply({
                content: "Bots don't have a level",
            });
            
        const { xp, level } = await getLevel(interaction.guild.id, member.id);

        const embed = new MessageEmbed()
            .setTitle(
                target.displayName.endsWith("s")
                    ? `${target.displayName}' level`
                    : `${target.displayName}'s level`
            )
            .setDescription(
                `XP: ${xp}
                Level: ${level}
                Next lvl: ${
                    (await getLevelXP(interaction.guild.id, member.id)) -
                    (xp)
                } xp`
            )
            .setColor(member.roles.highest.hexColor);

        return interaction.reply({
            embeds: [embed],
        });
    },
};
