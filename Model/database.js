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

  //Users
  manageUser: async (newUser) => {
    try {
      let userRef = await db
        .collection('users')
        .doc(newUser.userName)
        .get();
      if (!userRef.exists) {
        await db
          .collection('users')
          .doc(newUser.userName)
          .set(newUser);
        return newUser;
      } else {
        return userRef.data();
      }
    } catch (error) {
      throw error;
    }
  },
  getUsers: async () => {
    try {
      const markers = [];
      let userRef = await db.collection('users').get();
      userRef.forEach((doc) => {
        markers.push(doc.data());
      });
      return markers;
    } catch (error) {
      throw error;
    }
  },
  getCurrentUser: async (userName) => {
    try {
      let user = await db
        .collection('users')
        .doc(userName)
        .get();
      return user.data();
    } catch (error) {
      throw error;
    }
  },

  //Groups
  addGroup: async (newGroup) => {
    try {
      let collection = db.collection('groups');
      let currentUser = db
        .collection('users')
        .doc(newGroup.adminEmail)
        .update({
          groups: admin.firestore.FieldValue.arrayUnion(newGroup.groupName + '.' + newGroup.adminEmail),
        });
      let newGroupObject = await collection.doc(newGroup.groupName + '.' + newGroup.adminEmail).set(newGroup);
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
