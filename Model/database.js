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

  getGroupsByUserID: async (userID) => {
    let userDoc = await db
      .collection('users')
      .doc(userID)
      .get();
    if (!userDoc.empty) {
      // return Promise.resolve(userDoc.data().groups);
      let gidList = userDoc.data().groups;
      let resultArr = [];
      for (let i = 0; i < gidList.length; i++) {
        let gid = gidList[i];
        let grDoc = await db
          .collection('groups')
          .doc(gid)
          .get();
        if (!grDoc.empty) resultArr.push(grDoc.data());
      }
      return Promise.resolve(resultArr);
    }
    return Promise.reject(null);
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

  addMemberToGroup: async (groupid, listUserID) => {
    if (!(listUserID instanceof Array)) return Promise.reject(false);
    let grCollection = db.collection('groups').doc(groupid);
    let gr = await grCollection.get();
    if (!gr.empty) {
      let currListMember = gr.data().member;
      // console.log(currListMember);
      // let currListMember
      let userCollection = db.collection('users');
      for (let i = 0; i < listUserID.length; i++) {
        let uid = listUserID[i];
        currListMember.push(uid);
        var udoc = await userCollection.doc(uid).get();
        let newListGroup = udoc.data().groups;
        if (newListGroup == undefined) newListGroup = [];
        newListGroup.push(groupid);
        await userCollection.doc(uid).update({ groups: newListGroup });
      }
      await grCollection.update({
        member: currListMember,
      });
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },

  searchUser: async (keysearch) => {
    var keysearch = String(keysearch).toLowerCase();
    let userCollection = db.collection('users');
    let resultArray = await userCollection.where('userName', '>=', 'test').get();
    if (!resultArray.empty) {
      let userArr = [];
      resultArray.forEach((u) => {
        userArr.push(u.data());
      });
      return Promise.resolve(userArr);
    }
    return Promise.reject(null);
  },
  getUserTimeInGroup: async (groupid) => {
    let grCollection = await db
      .collection('groups')
      .doc(groupid)
      .get();
    // if(!grCollection.empty){
    //   //Todo: chỉnh tên biến range_from, range_to cho hợp với tên biến trên database, 2 biến này thể hiện khoảng thời gian admin mong muốn tổ chức meetings.
    //   let range_start= new Date(grCollection.data().range_from);
    //   let range_end=new Date(grCollection.data().range_to);
    //   let listMembers= grCollection.data().member;
    //   listMembers.forEach(memid => {
    //     let memDoc=await db.collection("users").doc(memid).get();
    //     if(!memDoc.empty){
    //       if(memDoc.data().freetimes != undefined1 && !(memDoc.data().freetimes instanceof Array)){
    //         for(let i=0; i< memDoc.data().freetimes.length; i++){
    //           //check time is current or future , if not delete it
    //           var freeFrom= new Date(freetimes[i].from);
    //           var freeTo= new Date(freetimes[i].to)
    //           var curDate=  new Date();
    //         }
    //       }
    //     }
    //   });
    // }
  },
};

module.exports = db_model;
db_model
  .getGroupsByUserID('thaihuynhatquang@gmail.com')
  .then((r) => console.log(r))
  .catch((e) => console.log(e));
// db_model.searchUser("quang").then(r=>console.log(r)).catch(e=>console.log(e));
// db_model.addMemberToGroup("Group1.thaihuynhatquang@gmail.com", ["00n1lBtebVkhUY5iSZPS","OJXKyv9giT6dXYTtw3zn"]);
// var x = {
//     username: "linhhtq@gmail.com",
//     locations: "hihihhih",
//     name:"linhtq"
// }
// db_model.addUser(x).then(r => console.log(r)).catch(e=> console.log("that bai"));
