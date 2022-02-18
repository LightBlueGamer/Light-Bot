const client = require("../index");
const { config } = require("../../db/index");
const economy = require("../modules/economy");
const levels = require("../modules/levels");

const ecoCooldown = new Set();
const lvlCooldown = new Set();

module.exports = {
    name: "messageCreate",
    async execute(message) {
        const prefix = await config.get(`${message.guild.id}.prefix`);

        if (message.author.bot) return;

        // Economy
        if (economy.isEnabled && await economy.getBalance(message.guild.id, message.author.id)) {
            const { balance, bank } = await economy.getBalance(message.guild.id, message.author.id);
            if (
                !ecoCooldown.has(`${message.guild.id}-${message.author.id}`)
            ) {
                await economy.messageIncome(message.guild.id, message.author.id);
                ecoCooldown.add(`${message.guild.id}-${message.author.id}`);
                setTimeout(() => {
                    ecoCooldown.delete(`${message.guild.id}-${message.author.id}`);
                }, (await config.get(`${message.guild.id}.economy.messageIncomeCooldown`)) * 1000);
            }
        }
        // Leveling
        if (levels.isEnabled && await levels.getLevel(message.guild.id, message.author.id)) {

            if (
                !lvlCooldown.has(`${message.guild.id}-${message.author.id}`)
            ) {
                await levels.messageIncome(message.guild.id, message.author.id);
                lvlCooldown.add(`${message.guild.id}-${message.author.id}`);

                setTimeout(() => {
                    lvlCooldown.delete(`${message.guild.id}-${message.author.id}`);
                }, 30 * 1000);
            }
        }

        const { xp, level } = await levels.getLevel(message.guild.id, message.author.id);
        if (xp >= (await levels.getLevelXP(message.guild.id, message.author.id))) {
            levels.levelUp(message.guild.id, message.author.id);
            const channel =
                (await config.get(`${message.guild.id}.leveling.levelUpChannel`)) === "same"
                    ? message.channel
                    : message.guild.channels.cache.get(
                          await config.get(`${message.guild.id}.leveling.levelUpChannel`)
                      );

            channel.send(
                `${message.member.displayName} you have leveled up to level \`${await levels.getLvl(
                    message.guild.id,
                    message.author.id
                )}\`!`
            );
        }

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const command = client.prefixCommands.get(commandName);

        if (!command)
            return message.reply({
                content: `There is no command named ${commandName}`,
                ephemeral: true,
            });

        try {
            command.execute(message, args);
        } catch (error) {
            console.log(error);
            return message.reply({
                content: `There was an error executing the command ${commandName}.`,
                ephemeral: true,
            });
        }
    },
};
