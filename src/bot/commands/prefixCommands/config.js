const { MessageEmbed } = require("discord.js");
const { config } = require("../../../db/index");

module.exports = {
    name: "config",
    description: "Configuration for the server",
    async execute(message, args) {
        if (!args[0])
            return message.reply({
                content:
                    "You must prove an argument\nAvailable arguments:\n`prefix: Change server bot prefix`\n`slashcommands: Toggle slash commands`",
            });

        if (args[0] === "prefix") {
            if (args[1].length < 1 || args[1].length > 5)
                return message.reply({
                    content:
                        "The new prefix must be at least 1 character long and less than 5 characters long",
                });
            else {
                await config.set(`${message.guild.id}.prefix`, args[1]);
                return message.reply({
                    content: `The server prefix has been changed to ${args[1]}`,
                });
            }
        } else if (args[0] === "slashcommands") {
            if (!args[1]) {
                await config.set(
                    `${message.guild.id}.slashcommands`,
                    !(await config.get(`${message.guild.id}.slashcommands`))
                );
                return message.reply({
                    content: `Slash commands have been set to ${await config.get(
                        `${message.guild.id}.slashcommands`
                    )}`,
                });
            } else {
                if (args[1] !== "true" || args[1] !== "false")
                    return message.reply({
                        content: "You can only set slash commands to true or false",
                    });
                else {
                    await config.set(`${message.guild.id}.slashcommands`, !!args[1]);
                    return message.reply({
                        content: `Slash commands have been set to ${args[1]}`,
                    });
                }
            }
        }
    },
};
