const { config, levels, economy } = require("../../db/index");

async function messageIncome(guildId, userId) {
    const [min, max] = "30,50".split(",").map(Number);
    const inc = max ? Math.round(Math.random() * (max - min) + min) : min;

    return await levels.math(`${guildId}-${userId}.xp`, "+", inc);
}

async function getLevelXP(guildId, userId) {
    let xp = 0;
    const lvl = await getLevel(guildId, userId);
    for (let i = 0; i < lvl.level; i++) {
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
    await economy.ensure(`${guildId}-${userId}`, {
        balance: await config.get(`${guildId}.economy.startingBalance`),
        bank: 0
    });
    return await levels.ensure(`${guildId}-${userId}`, {
        xp: 0,
        level: 0
    });
}

module.exports = {
    messageIncome,
    getLevelXP,
    levelUp,
    isEnabled,
    getLevel
};
