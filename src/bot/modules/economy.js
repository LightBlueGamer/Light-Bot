const { config, economy } = require("../../db/index");

async function messageIncome(guildId, userId) {
    const [min, max] = (await config.get(`${guildId}.economy.messageIncome`))
        .split(",")
        .map(Number);
    const inc = max ? Math.round(Math.random() * (max - min) + min) : min;

    return await economy.math(`${guildId}-${userId}.balance`, "+", inc);
}

async function deposit(guildId, userId, amount) {
    await economy.math(`${guildId}-${userId}.balance`, "-", parseInt(amount));
    await economy.math(`${guildId}-${userId}.bank`, "+", parseInt(amount));
    return `Successfully deposited ${amount} to your bank.`;
}

async function withdraw(guildId, userId, amount) {
    await economy.math(`${guildId}-${userId}.bank`, "-", parseInt(amount));
    await economy.math(`${guildId}-${userId}.balance`, "+", parseInt(amount));
    return `Successfully withdrew ${amount} from your bank.`;
}

async function isEnabled(guildId, userId) {
    return await config.get(`${guildId}.economy.enabled`);
}

async function getEconomy(guildId, userId) {
    return await economy.ensure(`${guildId}-${userId}`, {
        balance: await config.get(`${guildId}.economy.startingBalance`),
        bank: 0,
    });
}

module.exports = {
    messageIncome,
    deposit,
    withdraw,
    hasAccount,
    isEnabled,
    getEconomy,
};
