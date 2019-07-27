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
    return Promise.resolve(setAda);
  },

  //Users
  addUserDefaultProperties: (user) => {
    user.freetimes = [];
    user.groups = [];
    user.meetings = [];
    return user;
  },
  manageUser: async (newUser) => {
    try {
      let userRef = await db
        .collection('users')
        .doc(newUser.userName)
        .get();
      if (!userRef.exists) {
        newUser = this.addUserDefaultProperties(newUser);
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
    try {
      let userDoc = await db
        .collection('users')
        .doc(userID)
        .get();
      if (!userDoc.empty) {
        let gidList = userDoc.data().groups;
        if (gidList) {
          let resultArr = [];
          for (let i = 0; i < gidList.length; i++) {
            let gid = gidList[i];
            let grDoc = await db
              .collection('groups')
              .doc(gid)
              .get();
            if (!grDoc.empty) resultArr.push(grDoc.data());
          }
          return resultArr;
        } else return;
      }
    } catch (error) {
      throw error;
    }
  },
  updateFreeTime: async (userid, listFreeTime) => {
    let userCollection = db.collection('users');
    let userDoc = await userCollection.doc(userid).get();
    if (!userDoc.empty) {
      await userCollection.doc(userid).update({ freetimes: listFreeTime });
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  },
  updateProfile: async (userid, updateObject) => {
    let userCollection = db.collection('users');
    let userDoc = await userCollection.doc(userid).get();
    if (!userDoc.empty) {
      await userCollection.doc(userid).update(updateObject);
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  },
  getUserProfile: async (uid) => {
    let userCollection = db.collection('users');
    let userDoc = await userCollection.doc(userid).get();
    if (!userDoc.empty) {
      let user = userDoc.data();
      delete user.dark;
      user.id = u.id;
      return Promise.resolve(user);
    }
    return Promise.reject(null);
  },

  //Groups
  getGroup: async (groupID) => {
    try {
      let group = await db
        .collection('groups')
        .doc(groupID)
        .get();
      console.log(group.data());
      return group.data();
    } catch (error) {
      throw error;
    }
  },
  addGroupDefaultProperties: (group) => {
    group.member = [];
  },
  getGroupInfo: async (groupID) => {
    let grCollection = await db
      .collection('groups')
      .doc(groupID)
      .get();
    if (!grCollection.empty) {
      let gr = grCollection.data();
      // gr.id=groupID;
      return Promise.reject(gr);
    }
    return Promise.reject(null);
  },
  addGroup: async (newGroup) => {
    try {
      let collection = db.collection('groups');
      newGroup = this.addGroupDefaultProperties(newGroup);
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
  addMemberToGroup: async (groupID, listMemberID) => {
    if (!(listMemberID instanceof Array)) return Promise.reject(false);
    let groupDocRef = db.collection('groups').doc(groupID);
    let group = await groupDocRef.get();
    if (!group.empty) {
      let currListMember = group.data().member;
      let userCollectionRef = db.collection('users');
      for (let i = 0; i < listMemberID.length; i++) {
        let uid = listMemberID[i];
        currListMember.push(uid);
        var udoc = await userCollectionRef.doc(uid).get();
        let newListGroup = udoc.data().groups;
        if (newListGroup == undefined) newListGroup = [];
        newListGroup.push(groupID);
        await userCollectionRef.doc(uid).update({ groups: newListGroup });
      }
      await groupDocRef.update({ member: currListMember });
    }
    return groupDocRef.get().data()
  },
  searchUser: async (keysearch) => {
    var keysearch = String(keysearch)
      .toLowerCase()
      .trim();
    if (keysearch == '') return Promise.resolve(false);
    let userCollection = db.collection('users');
    let resultArray = await userCollection.where('userName', '==', keysearch).get();
    if (!resultArray.empty) {
      let userArr = [];
      resultArray.forEach((u) => {
        let user = u.data();
        delete user.groups;
        delete user.dark;
        user.id = u.id;
        userArr.push(user);
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
    if (!grCollection.empty) {
      //Todo: chỉnh tên biến range_from, range_to cho hợp với tên biến trên database, 2 biến này thể hiện khoảng thời gian admin mong muốn tổ chức meetings.
      let range_start = new Date(grCollection.data().range_from.toDate());
      let range_end = new Date(grCollection.data().range_to.toDate());
      let listMembers = grCollection.data().member;
      let resultUserTimeArr = [];
      for (var m = 0; m < listMembers.length; m++) {
        let memid = listMembers[m];
        let memDoc = await db
          .collection('users')
          .doc(memid)
          .get();
        if (!memDoc.empty) {
          let userTimeArr = {};
          userTimeArr.name = memDoc.data().name;

          if (memDoc.data().freetimes != undefined && memDoc.data().freetimes instanceof Array) {
            let freeTimeList = memDoc.data().freetimes;
            userTimeArr.freetimes = [];
            let overDateData = [];
            for (let i = 0; i < freeTimeList.length; i++) {
              //check time is current or future , if not delete it
              var freeFrom = new Date(freeTimeList[i].from.toDate());
              var freeTo = new Date(freeTimeList[i].to.toDate());
              var curDate = new Date();
              if (freeTo < curDate) {
                overDateData.push(i);
                continue;
              } else {
                // if(freeFrom<=range_end){
                let freetime = {};
                freetime.from = freeFrom > range_start ? freeFrom : range_start;
                freetime.to = freeTo < range_end ? freeTo : range_end;
                userTimeArr.freetimes.push(freetime);
                // }
              }
            }
            // Todo : xóa bỏ các khoảng thời gian đã hết hạn của người dùng ( có index được lưu trong mảng overDateData)
          }
          resultUserTimeArr.push(userTimeArr);
        }
      }

      return Promise.resolve(resultUserTimeArr);
    }
    return Promise.reject(null);
  },
};
// var freetime=[{from:new Date(2019,7,27,0,0,0,0),to:new Date(2019,7,27,10,0,0,0,0)},{from:new Date(2019,8,27,0,0,0,0),to:new Date(2019,8,27,10,0,0,0,0)}]
module.exports = db_model;
// db_model
//   .updateFreeTime("laivansam1998@gmail.com",freetime)
//   .then((r) => console.log(r))
//   .catch((e) => console.log(e));
// db_model
//   .getGroupInfo('SGUET.thaihuynhatquang@gmail.com')
//   .then((r) => console.log(r))
//   .catch((e) => console.log(e));
// db_model.searchUser("thaihuynhatquang@gmail.com").then(r=>console.log(r)).catch(e=>console.log(e));
// db_model.addMemberToGroup("Group1.thaihuynhatquang@gmail.com", ["00n1lBtebVkhUY5iSZPS","OJXKyv9giT6dXYTtw3zn"]);
// var x = {
//     username: "linhhtq@gmail.com",
//     locations: "hihihhih",
//     name:"linhtq"
// }
// db_model.addUser(x).then(r => console.log(r)).catch(e=> console.log("that bai"));
