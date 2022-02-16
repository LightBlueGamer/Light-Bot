const { config, levels } = require("../../db/index");

async function setup(guildId, userId) {
    return await levels.ensure(`${guildId}-${userId}`, {
        xp: 0,
        level: 0,
    });
}

async function messageIncome(guildId, userId) {
    const [min, max] = "30,50".split(",").map(Number);
    const inc = max ? Math.round(Math.random() * (max - min) + min) : min;

    return await levels.math(`${guildId}-${userId}.xp`, "+", inc);
}

async function getXp(guildId, userId) {
    return await levels.get(`${guildId}-${userId}.xp`);
}

async function getLvl(guildId, userId) {
    return await levels.get(`${guildId}-${userId}.level`);
}

async function hasAccount(guildId, userId) {
    return await levels.has(`${guildId}-${userId}`);
}

async function getLevelXP(guildId, userId) {
    let xp = 0;
    const level = await getLvl(guildId, userId);
    for (let i = 0; i < level; i++) {
        xp += 100 * i + 75;
    }
    return xp;
}

async function levelUp(guildId, userId) {
    return await levels.inc(`${guildId}-${userId}.level`);
}

async function isEnabled(guildId, userId) {
    return await config.get(`${guildId}.leveling.enabled`);
}

module.exports = {
    setup,
    messageIncome,
    getXp,
    getLvl,
    hasAccount,
    getLevelXP,
    levelUp,
    isEnabled,
};
