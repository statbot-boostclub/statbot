const { dbRealtime } = require('./firebase.cjs');

async function getTop5() {
  const snapshot = await dbRealtime.ref('scores').get();
  if (!snapshot.exists()) return [];

  const all = Object.entries(snapshot.val())
    .filter(([, user]) => typeof user.total === 'number')
    .map(([id, user]) => ({
      id,
      pseudo: user.pseudo || 'Inconnu',
      score: user.total
    }));

  const sorted = all.sort((a, b) => b.score - a.score);
  return sorted.slice(0, 5);
}

module.exports = getTop5;
