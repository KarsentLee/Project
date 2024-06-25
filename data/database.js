const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect("mongodb://localhost:27017");
  // the database will be called "online-shop"
  database = client.db("online-shop");
}

function getDb() {
  if (!database) {
    throw new Error("not connected to server");
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
