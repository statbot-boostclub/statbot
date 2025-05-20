const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('score')
    .setDescription("Affiche ton score actuel 🎯"),

  new SlashCommandBuilder()
  .setName('help')
  .setDescription("Statbot : Affiche la liste des commandes disponibles 🧭"),

  new SlashCommandBuilder()
    .setName('top5')
    .setDescription("Affiche le top 5 des scores 🌟"),

  new SlashCommandBuilder()
    .setName('étoile')
    .setDescription("Offre une étoile à quelqu’un ⭐")
    .addUserOption(option =>
      option.setName('utilisateur')
        .setDescription('À qui veux-tu attribuer une étoile ?')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('valeur')
        .setDescription('Pour quelle qualité ?')
        .setRequired(true)
        .addChoices(
          { name: "Persévérance", value: "perseverance" },
          { name: "Entraide", value: "entraide" },
          { name: "Régularité", value: "regularite" },
          { name: "Créativité", value: "creativite" },
          { name: "Bienveillance", value: "bienveillance" },
          { name: "Prise de parole", value: "prise-de-parole" },
          { name: "Vulnérabilité", value: "vulnerabilite" },
          { name: "Écoute", value: "ecoute" },
          { name: "Clarté", value: "clarte" },
          { name: "Courage", value: "courage" },
          { name: "Transparence", value: "transparence" },
          { name: "Évolution", value: "evolution" }
        ))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('⏳ Enregistrement des slash commands...');

    await rest.put(
  Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
  { body: commands },
);

    console.log('✅ Slash commands enregistrées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l’enregistrement :', error);
  }
})();
