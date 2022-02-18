require("dotenv").config();

const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const client = require("./index");
const { config } = require("../db/index");

const commands = [];
const commandFiles = fs
    .readdirSync(`${__dirname}/commands/slashCommands`)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/slashCommands/${file}`);
    commands.push(command.data);
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

client.guilds.cache
    .forEach(async (guild) => {
        if (await config.get(`${guild.id}.slashcommands`)) {
            rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id), {
                body: commands,
            })
            .then(() => console.log(`Slash commands enabled for ${guild.name}`))
            .catch(console.error);
        }
    })
