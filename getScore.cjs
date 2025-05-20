const { dbRealtime } = require('./firebase.cjs');

async function getScore(userId) {
  const userRef = dbRealtime.ref(`scores/${userId}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists()) return null;

  const data = snapshot.val();

  return {
    pseudo: data.pseudo || 'Inconnu',
    total: data.total || 0,
    parSalon: data.parSalon || {},
    lastActive: data.lastActive || null
  };
}

module.exports = getScore;
