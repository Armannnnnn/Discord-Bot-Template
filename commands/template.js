const { SlashCommandBuilder } = require("@discordjs/builders");
const client = require("../index.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("template")
        .setDescription("Template slash command.")
        .addStringOption((option) =>
            option.setName("string").setDescription("String option.").setRequired(true))
        .addStringOption((option) =>
            option.setName("choices").setDescription("String option with choices.").setRequired(true).addChoices(
                { name: 'Choice A', value: "A" },
                { name: 'Choice B', value: "B" },
                { name: 'Choice C', value: "C" }))
        .addUserOption((option) =>
            option.setName("user").setDescription("User option.").setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel option.').setRequired(true))
        .addBooleanOption(option =>
            option.setName('boolean')
                .setDescription('Boolean option.').setRequired(true))
        .addIntegerOption(option =>
            option.setName('integer')
                .setDescription('Integer option with min and max.').setMinValue(1).setMaxValue(100).setRequired(true))
        .addNumberOption(option =>
            option.setName('number')
                .setDescription('Number option.').setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Role option.').setRequired(true))
        .addAttachmentOption(option =>
            option.setName('attachment')
                .setDescription('Optional attachment option.').setRequired(false)),

    async execute(interaction) {
        if (!interaction.member.roles.cache.some(r => r.name === "Sample Role")) { // example role check
            await interaction.reply({ content: "You do not have the role required to run this command!", ephemeral: true });
            return;
        }
        // retrieving the command arguments
        const str = interaction.options.getString("string");
        const choice = interaction.options.getString("choices");
        const user = interaction.options.getUser("user");
        const channel = interaction.options.getChannel("channel");
        const bool = interaction.options.getBoolean("boolean");
        const integer = interaction.options.getInteger("integer");
        const num = interaction.options.getNumber("number");
        const role = interaction.options.getRole("role");
        const attachment = interaction.options.getAttachment("attachment"); // some attachment properties are attachment.name, attachment.url, and attachment.proxyURL
        client.users.send(user.id, { content: `This is a DM to ${user}` }); // example DM
        await interaction.reply({ content: `Hello world` });
    }
}
