const { Client, GatewayIntentBits, Collection, ActivityType, InteractionType } = require('discord.js');
require("dotenv").config();
const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
module.exports = client; // export client for use in other files





const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const commands = [];

client.commands = new Collection();

// command handler
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}


client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setStatus('dnd'); // example online status. Options are online, idle, invisible, dnd.
    client.user.setActivity("Custom Status", { // example custom status. Activity types for API v9 can be found at https://discord-api-types.dev/api/discord-api-types-v9/enum/ActivityType
        type: ActivityType.Playing,
      });

    const CLIENT_ID = client.user.id;

    const rest = new REST({
        version: "9"
    }).setToken(process.env.TOKEN);
    (async () => {
        try {
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                });
                console.log("Successfully registered commands globally.")

        }
        catch(err) {
            if (err) console.error(err)
        }
})();
});

client.on("interactionCreate", async interaction => {
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
       if (err) console.error(err) 

       await interaction.reply({
        content: "An error occured while executing that command.",
        ephemeral: true,
       })
    }

});



client.login(process.env.TOKEN)
