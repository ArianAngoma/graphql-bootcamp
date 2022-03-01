const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO);
    console.log('DB online');
  } catch (e) {
    console.log(e);
    throw new Error('Error al conectar DB');
  }
};

module.exports = dbConnection;
