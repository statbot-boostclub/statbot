const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json'); // Remplace la lecture via process.env

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://boostclub-bot-default-rtdb.europe-west1.firebasedatabase.app"
});

const dbRealtime = admin.database();      // Pour /score

module.exports = { dbRealtime, dbFirestore };