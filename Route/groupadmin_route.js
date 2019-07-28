var db = require('../Model/database');
const secure = require('./secure');

var groupadmin_router = {
  getGroup: async (req, res) => {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      let groupID = req.body.groupID;
      db.getGroup(groupID)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((error) => {
          console.log(error);
          res.statusCode = 400;
          res.send(error);
        });
    }
  },
  //To Do
  getLocation: async (req, res) => {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      let userName = user.u;

      const groupName = req.body.name;
      const groupID = groupName + '.' + userName;
      console.log(groupID);

      db.getListMember(groupID)
        .then((result) => {

          result.forEach((member) => {
            db.getLocationFromUserName(groupName, member).then((r) => {
              if (r) {
                let temp = r.location;
                let tempLocation = { name: member, lat: temp.lat, lon: temp.lon };
                // console.log(temp);

                res.status(200).send(tempLocation);
              }
            });
          });

        })
        .catch((error) => {
          console.log(error);
          res.statusCode = 400;
          res.send();
        });
    }
  },

  getGroupsByUserID: async (req, res) => {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      let username = secure.verifyUserToken(req.headers.authorization).u;
      db.getGroupsByUserID(username)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((error) => {
          console.log(error);
          res.statusCode = 400;
          res.send();
        });
    }
  },

  createGroup: async function(req, res) {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      var newGroups = {};
      let groupAvatar = req.files != null ? req.files.groupAvatar : null;
      try {
        if (groupAvatar !== null) {
          var path = require('path');
          // // tạo ra đường dẫn để lưu vào database
          let databasePath = user.u + '__' + secure.createSalt() + groupAvatar.name;
          // // tạo đường dẫn để ghi file
          let serverPath = '/images/groups/' + databasePath;

          // console.log(databasePath, " <- databasePath");
          var file = path.join(__dirname, '..', serverPath);
          await groupAvatar.mv(file);
          newGroups.groupAvatar = serverPath;
        }
        (newGroups.groupName = req.body.groupName),
          (newGroups.category = req.body.category),
          (newGroups.adminEmail = req.body.adminEmail),
          (newGroups.description = req.body.description),
          await db.addGroup(newGroups);
        res.status(200).send(newGroups);
      } catch (error) {
        console.log(error);
        res.statusCode = 400;
        res.send();
      }
    }
  },

  updateGroupMembers: async (req, res) => {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      let listMemberID = req.body.listMemberID;
      let groupID = req.body.groupID;

      db.addMemberToGroup(groupID, listMemberID)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((error) => {
          console.log(error);
          res.statusCode = 400;
          res.send();
        });
    }
  },
};
module.exports = groupadmin_router;
