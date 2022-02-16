module.exports = {
    prefix: "-",
    slashcommands: true,
    economy: {
        enabled: true,
        currency: "${balance}",
        startingBalance: 100,
        canGoInDebt: true,
        messageIncome: "2,5",
        messageIncomeCooldown: 30,
        incomeDisabledChannels: [],
        reverseIncomeDisabledChannels: false,
    },
    leveling: {
        enabled: true,
        levelUpChannel: "same",
        incomeDisabledChannels: [],
        reverseIncomeDisabledChannels: false,
    },
};
