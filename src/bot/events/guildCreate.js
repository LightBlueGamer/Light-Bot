const { config } = require("../../db/index.js");
const serverConfig = require("../../../server-config.js");

module.exports = {
    name: "guildCreate",
    once: false,
    async execute(guild) {
        await config.ensure(guild.id, serverConfig);
        console.log(`${guild.name} saved server configuration.`);
    },
};
