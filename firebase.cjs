const admin = require('firebase-admin');
const serviceAccount = require('./firebase_config.json');

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://statbot-626ff-default-rtdb.europe-west1.firebasedatabase.app' // ✅ Spécifique à ton projet
});

const dbRealtime = admin.database();

module.exports = {
  database: dbRealtime,
  dbRealtime,
  app
};
