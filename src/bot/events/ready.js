const { config, economy } = require("../../db/index.js");
const serverConfig = require("../../../server-config.js");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        let users = 0;
        const guilds = client.guilds.cache;
        for (const guildData of guilds) {
            users += client.guilds.cache.get(guildData[0]).memberCount;
            await config.ensure(guildData[0], serverConfig);
        }
        console.log(
            `Ready! Logged in as ${
                client.user.tag
            }\n${await config.size} server configurations stored.\nAwaiting commands in ${
                guilds.size
            } servers from ${users} users!`
        );
    },
};
