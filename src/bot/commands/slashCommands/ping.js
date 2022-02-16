const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!").toJSON(),
    async execute(interaction) {
        await interaction.reply({
            content: "Pong!",
            ephemeral: true,
        });
    },
};
