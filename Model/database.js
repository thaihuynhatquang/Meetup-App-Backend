var admin = require('firebase-admin');

var serviceAccount = require('./testmeetup-f5f98-firebase-adminsdk-oujh1-a20533e0bf.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://testmeetup-f5f98.firebaseio.com',
});

var db = admin.firestore();

var db_model = {
  add2DB: async function() {
    //example
    let docRef = db.collection('users').doc();
    let setAda = await docRef.set({
      first: 'Ada',
      last: 'Lovelace',
      born: 1815,
    });
    console.log(setAda);
    return Promise.resolve(setAda);
  },
  addUser: async function(user) {
    try {
      let collection = db.collection('users');
      let snapshot = await collection.where('email', '==', user.username).get();
      if (snapshot.empty) {
        console.log('User chua ton tai, tao tai khoan moi');
        await collection.doc().set(user);
        return Promise.resolve(true);
      } else {
        console.log('User da ton tai :)');
        return Promise.reject(false);
      }
      // console.log(query.fieldFilters);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getUser: async function(username) {
    try {
      let collection = db.collection('users');
      let snapshot = await collection.where('username', '==', username).get();
      if (!snapshot.empty) {
        return Promise.resolve(snapshot.docs[0].data());
      } else {
        return Promise.reject(null);
      }
      // console.log(query.fieldFilters);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  addGroup: async (newGroup) => {
    try {
      let collection = db.collection('groups');
      let newGroupObject = await collection.doc().set(newGroup);
      return Promise.resolve(newGroupObject);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

module.exports = db_model;
// var x = {
//     username: "linhhtq@gmail.com",
//     locations: "hihihhih",
//     name:"linhtq"
// }
// db_model.addUser(x).then(r => console.log(r)).catch(e=> console.log("that bai"));
