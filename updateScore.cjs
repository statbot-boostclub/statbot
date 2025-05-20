const { dbRealtime } = require('./firebase.cjs');

async function updateScore(userId, pseudo, points, salon) {
  const userRef = dbRealtime.ref(`scores/${userId}`);
  const snapshot = await userRef.get();

  const oldData = snapshot.exists() ? snapshot.val() : {
    pseudo,
    lastActive: null,
    total: 0,
    parSalon: {}
  };

  const today = new Date().toISOString().split("T")[0];

  // 👤 Mise à jour pseudo et date d’activité
  const updatedData = {
    pseudo,
    lastActive: today,
    parSalon: oldData.parSalon || {}
  };

  // ➕ Incrément du score pour le salon concerné
  if (!updatedData.parSalon[salon]) {
    updatedData.parSalon[salon] = 0;
  }
  updatedData.parSalon[salon] += points;

  // 🔢 Calcul du total global
  updatedData.total = Object.values(updatedData.parSalon).reduce((a, b) => a + b, 0);

  // 💾 Sauvegarde dans Firebase
  await userRef.set(updatedData);
}

module.exports = updateScore;