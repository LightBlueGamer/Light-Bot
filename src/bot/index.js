require("dotenv").config();

const fs = require("fs");

const { Client, Collection, Intents } = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
module.exports = client;

const eventFiles = fs.readdirSync(`${__dirname}/events`).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.slashCommands = new Collection();
client.prefixCommands = new Collection();

const slashCommandFiles = fs
    .readdirSync(`${__dirname}/commands/slashCommands`)
    .filter((file) => file.endsWith(".js"));

for (const file of slashCommandFiles) {
    const command = require(`./commands/slashCommands/${file}`);
    client.slashCommands.set(command.data.name, command);
}

const prefixCommandFiles = fs
    .readdirSync(`${__dirname}/commands/prefixCommands`)
    .filter((file) => file.endsWith(".js"));

for (const file of prefixCommandFiles) {
    const command = require(`./commands/prefixCommands/${file}`);
    client.prefixCommands.set(command.name, command);
}

client.login(process.env.DISCORD_TOKEN);
