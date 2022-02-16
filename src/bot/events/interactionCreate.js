const client = require("../index");
const { config } = require("../../db/index");

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (!(await config.get(`${interaction.guild.id}.slashcommands`)))
            return interaction.reply({
                content: "Slash commands are disabled on this server.",
                ephemeral: true,
            });

        const command = client.slashCommands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    },
};
