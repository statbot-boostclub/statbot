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

  const updatedData = {
    pseudo,
    lastActive: today,
    parSalon: oldData.parSalon || {}
  };

  if (!updatedData.parSalon[salon]) {
    updatedData.parSalon[salon] = 0;
  }
  updatedData.parSalon[salon] += points;

  updatedData.total = Object.values(updatedData.parSalon).reduce((a, b) => a + b, 0);

  await userRef.set(updatedData);
}

module.exports = updateScore;
