require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const getScore = require('./getScore.cjs');
const getTop5 = require('./getTop5.cjs');
const updateScore = require('./updateScore.cjs');

const PORT = process.env.PORT || 10000;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

client.once(Events.ClientReady, () => {
  console.log(`✅ StatBot prêt ! Connecté en tant que ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

 // /score
if (commandName === 'score') {
  const start = Date.now();

  try {
    // Répondre le plus vite possible
    await interaction.deferReply({ flags: 64 });

    const userData = await getScore(interaction.user.id);

    if (userData) {
      return interaction.editReply(`🎯 Ton score actuel est de **${userData.total}** points.`);
    } else {
      return interaction.editReply("🙈 Tu n'as pas encore de points cette semaine.");
    }
  } catch (err) {
    console.error("❌ Erreur dans /score :", err);

    try {
      await interaction.editReply("⚠️ Impossible de récupérer ton score pour le moment.");
    } catch (e) {
      console.error("❌ Impossible d’éditer la réponse :", e);
    }
  }
}

  // /top5
  if (commandName === 'top5') {
    try {
      await interaction.deferReply();
      const top5 = await getTop5();

      if (top5.length === 0) {
        return interaction.editReply("Aucun score pour l'instant.");
      }

      const reply = top5.map((u, i) => `${i + 1}. <@${u.id}> – ${u.score} pts`).join('\n');
      return interaction.editReply(`🌟 **Top 5 de la semaine :**\n${reply}`);
    } catch (err) {
      console.error("❌ Erreur dans /top5 :", err);
      return interaction.editReply("⚠️ Une erreur est survenue en récupérant le top 5.");
    }
  }
  // /help
  if (commandName === 'help') {
    const message = `**Bienvenue sur StatBot 🎉**

Voici tout ce que tu peux faire avec les commandes Slash ⬇️ :

🎯 **Commandes utiles :**  
• **/étoile** → Félicite un membre pour une qualité 💛  
• **/score** → Consulte ton score de la semaine 📈  
• **/top5** → Découvre les 5 membres les plus engagés cette semaine 🔥

🏆 **Système de points :**  
Chaque message dans certains salons (planning, update, bilan, papotages...) te fait gagner des points.  
Les plus réguliers reçoivent le rôle **BoostStar** 🌟 pour valoriser leur présence et leur élan.`;

    await interaction.reply({ content: message, flags: 64 });
  }


  // /étoile
  if (commandName === 'étoile') {
    try {
      const target = interaction.options.getUser('utilisateur');
      const valeur = interaction.options.getString('valeur');
      const auteur = interaction.user;
      const member = await interaction.guild.members.fetch(target.id);

      const valeursBoostables = {
        perseverance: { label: "sa persévérance", emoji: "💪" },
        entraide: { label: "son entraide", emoji: "🤝" },
        regularite: { label: "sa régularité", emoji: "🧱" },
        creativite: { label: "sa créativité", emoji: "🎨" },
        bienveillance: { label: "sa bienveillance", emoji: "💛" },
        "prise-de-parole": { label: "sa prise de parole", emoji: "🎤" },
        vulnerabilite: { label: "sa vulnérabilité", emoji: "🫶" },
        ecoute: { label: "son écoute", emoji: "👂" },
        clarte: { label: "sa clarté", emoji: "🔍" },
        courage: { label: "son courage", emoji: "🚀" },
        transparence: { label: "sa transparence", emoji: "🪞" },
        evolution: { label: "son évolution", emoji: "📈" }
      };

      const clôtures = [
        "Merci de rayonner comme tu le fais.",
        "Tu fais une vraie différence ici.",
        "Ta présence a un impact. Ne l’oublie pas.",
        "Tu sèmes quelque chose de beau autour de toi.",
        "Continue comme ça. C’est précieux.",
        "On est chanceux·ses de t’avoir dans le club.",
        "Merci d’être toi, vraiment.",
        "C’est inspirant de te voir avancer comme ça.",
        "Ton authenticité touche bien plus de monde que tu ne l’imagines.",
        "Ta vulnérabilité est une preuve de courage, pas de faiblesse.",
        "Ta lumière éclaire plus que tu ne le crois.",
        "Tu offres une énergie qui réchauffe le groupe.",
        "Chaque mot que tu poses compte pour quelqu’un ici.",
        "Ta constance est un vrai repère.",
        "Tu fais grandir ce club par ta seule présence.",
        "Merci pour la sincérité que tu apportes.",
        "Ta force tranquille fait du bien autour de toi.",
        "On voit ton courage, même dans les petits gestes.",
        "Tu es une source d’inspiration silencieuse.",
        "Rien que ta présence rend ce lieu plus humain.",
        "Ce que tu partages a du poids, du sens, de l’âme.",
        "Tu mets du cœur dans ce que tu fais. Et ça se sent.",
        "Merci de faire exister BoostClub comme tu le fais."
      ];

      const qualité = valeursBoostables[valeur];
      const clôture = clôtures[Math.floor(Math.random() * clôtures.length)];

      const message = `⭐ ${target} a reçu une étoile de ${auteur} pour **${qualité.label}** ${qualité.emoji}\n${clôture}`;

      await updateScore(target.id, member.displayName, 3, 'étoiles');

      await interaction.reply(message);
    } catch (err) {
      console.error("❌ Erreur dans /étoile :", err);
      await interaction.reply({
        content: "⚠️ Une erreur est survenue en attribuant l’étoile.",
        flags: 64
      });
    }
  }
});

client.on(Events.MessageCreate, async message => {
  // Ignore les messages du bot lui-même
  if (message.author.bot) return;

  const salon = message.channel.name;
  const scoreMap = {
    '📅lundi-planning': 10,
    '📊mercredi-update': 5,
    '📝vendredi-bilan': 5,
    '🌟réussites-du-jour': 5,
    '💭besoin-de-vos-avis': 3,
    '💻open-space': 1,
    '💬papotages': 1,
    '🤸bien-être': 1
  };

  const points = scoreMap[salon];
  if (!points) return; // Pas un salon comptabilisé

  try {
    await updateScore(message.author.id, message.member.displayName, points, salon);
    console.log(`✅ +${points} points pour ${message.member.displayName} dans ${salon}`);
  } catch (err) {
    console.error("❌ Erreur updateScore :", err);
  }
});

client.login(process.env.DISCORD_TOKEN);

// 🟡 Render keep-alive (pour éviter l’arrêt automatique)
const express = require('express');
const http = require('http');
const app = express();

app.get('/', (req, res) => {
  res.send('StatBot actif 🚀');
});

app.listen(PORT, () => {
  console.log(`🟢 Serveur HTTP actif sur le port ${PORT}`);
});

setInterval(() => {
  http.get(`http://localhost:${PORT}`, res => {
    console.log(`🔁 Ping Render : ${res.statusCode}`);
  });
}, 5 * 60 * 1000);