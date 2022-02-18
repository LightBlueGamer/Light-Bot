const { economy, levels, config } = require("../../../db/index");
const { getBalance } = require("../../modules/economy.js");
const { getLevel } = require("../../modules/levels.js");
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "leaderboard",
    description: "Shows the server leaderboard",
    async execute(message, args) {
        const users = [];
        const arg1 = args[1];
        const page = !arg1 ? 1 : isNaN(arg1) ? 1 : parseInt(arg1);
        const pageIdx = page - 1;

        for(const key of await (economy.keys)) {
            if(key.split('-')[0] === message.guild.id) {
                const { balance, bank } = await getBalance(message.guild.id, message.author.id);
                const { xp, level } = await getLevel(message.guild.id, message.author.id);
                const user = await message.client.users.fetch(key.split('-')[1]);

                users.push({
                    name: user.username,
                    id: key.split('-')[1],
                    xp,
                    level,
                    balance,
                    bank,
                    total: balance+bank
                });
            };
        };

        if(args[0] === "economy") {
            const currency = await config.get(`${message.guild.id}.economy.currency`);
            const sorted = users.sort((a, b) => {
                if(a.total < b.total) return 1;
                else if(a.total > b.total) return -1;
                else return 0;
            });
    
            const top10 = sorted.slice(pageIdx * 10, pageIdx * 10 + 10);

            const embed = new MessageEmbed()
            .setTitle(`${message.guild.name} top ${pageIdx * 10 + 10}`)
            .setColor(message.member.roles.highest.hexColor)
            .setFooter({
                text: `You are #${sorted.findIndex(x => x.id === message.author.id)+1} out of ${sorted.length}.`
            })
            for(let i=0; i<top10.length; i++) {
                const ind = top10[i];
                embed.addField(`#${sorted.indexOf(ind)+1} ${ind.name}`,`Total: ${ind.total}\nBalance: ${currency.replace("{balance}",ind.balance)}\nBank: ${currency.replace("{balance}",ind.bank)}`)
            };
            return message.reply({
                embeds: [embed]
            });

        } else if(args[0] === "levels") {
            const sorted = users.sort((a, b) => {
                if(a.xp < b.xp) return 1;
                else if(a.xp > b.xp) return -1;
                else return 0;
            });
    
            const top10 = sorted.slice(pageIdx * 10, pageIdx * 10 + 10);

            const embed = new MessageEmbed()
            .setTitle(`${message.guild.name} top ${pageIdx * 10 + 10}`)
            .setColor(message.member.roles.highest.hexColor)
            .setFooter({
                text: `You are #${sorted.findIndex(x => x.id === message.author.id)+1} out of ${sorted.length}.`
            })
            for(let i=0; i<top10.length; i++) {
                const ind = top10[i];
                console.log(ind)
                embed.addField(`#${sorted.indexOf(ind)+1} ${ind.name}`,`Level: ${ind.level}\nExp: ${ind.xp}`)
            };
            return message.reply({
                embeds: [embed]
            });

        } else {
            return message.reply({
                content: "You must specify either the `economy` or `levels` leaderboard."
            });
        }
    },
};
