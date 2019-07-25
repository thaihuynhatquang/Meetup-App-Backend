var mongoClient = require("mongodb").MongoClient;
// const url = "mongodb://server:5sLUdMe7XGk2iSM@ds153766.mlab.com:53766/weather";
const url = "mongodb://localhost:27017/weather"
// 'mongodb://linh:dEG5kkBdWqFeCQ6@ds147454.mlab.com:47454/alpha'
var ObjectId = require("mongodb").ObjectID;
var dbmodel = {
  addUser: async function(user) {
    let client = await mongoClient.connect(url, { useNewUrlParser: true });
    let db = client.db("weather");
    try {
      let object = await db
        .collection("User")
        .findOne({ username: user.username });
      if (object != null) return Promise.reject("usernameAlreadyInSystem");
      let a = await db.collection("User").insertOne(user);
      return Promise.resolve(a.insertedId);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      client.close();
    }
  },
  getUser: async function(username) {
    let client = await mongoClient.connect(url, { useNewUrlParser: true });
    let db = client.db("weather");
    try {
      let object = await db.collection("User").findOne({ username: username });
      if (object != null) {
        return Promise.resolve(object);
      }
      return Promise.reject("notFound");
    } catch (error) {
      return Promise.reject(error);
    } finally {
      client.close();
    }
  }
};


function objectIdWithTimestamp(timestamp) {
  // Convert string date to Date object (otherwise assume timestamp is a date)
  if (typeof timestamp == "string") {
    timestamp = new Date(timestamp);
  }
  // Convert date object to hex seconds since Unix epoch
  var hexSeconds = Math.floor(timestamp / 1000).toString(16);
  // Create an ObjectId with that hex timestamp
  var constructedObjectId = ObjectId(hexSeconds + "0000000000000000");
  return constructedObjectId;
}

module.exports = dbmodel;
// dbmodel.getListNews_orderByLocation(4, 0, 21, 105).then(r => console.log(r)).catch(e => console.log(e));
