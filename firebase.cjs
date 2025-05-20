const admin = require('firebase-admin');

// 🔐 Lire et corriger la config depuis l’environnement Render
const rawConfig = JSON.parse(process.env.FIREBASE_CONFIG);
rawConfig.private_key = rawConfig.private_key.replace(/\\n/g, '\n');

// 🔧 Initialisation Firebase
const app = admin.initializeApp({
  credential: admin.credential.cert(rawConfig),
  databaseURL: 'https://statbot-626ff-default-rtdb.europe-west1.firebasedatabase.app'
});

const dbRealtime = admin.database();

module.exports = {
  database: dbRealtime,
  dbRealtime,
  app
};