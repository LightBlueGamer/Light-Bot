const { config, levels } = require("../../db/index");

async function messageIncome(guildId, userId) {
    const [min, max] = "30,50".split(",").map(Number);
    const inc = max ? Math.round(Math.random() * (max - min) + min) : min;

    return await levels.math(`${guildId}-${userId}.xp`, "+", inc);
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

async function getLevel(guildId, userId) {
    return await levels.ensure(`${guildId}-${userId}`, {
        xp: 0,
        level: 0,
    });
}

module.exports = {
    messageIncome,
    hasAccount,
    getLevelXP,
    levelUp,
    isEnabled,
    getLevel
};
