var db = require('../Model/database');
const secure = require('./secure');
var verifier = require('google-id-token-verifier');
var androidId = require('./key').google.androidID;
var iosId = require('./key').google.iosID;

var groupadmin_router = {
  createGroup: async function(req, res) {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      // token không xác thực được
      res.statusCode = 401;
      res.send();
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
          newGroups.groupAvatar = databasePath;
        }
        (newGroups.name = req.body.name),
          (newGroups.category = req.body.category),
          (newGroups.adminEmail = req.body.adminEmail),
          (newGroups.description = req.body.description),
          (newGroups.member = req.body.member);
        console.log(newGroups);
        await db.addGroup(newGroups);
        res.status(201).send(newGroups);
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.send();
        // return Promise.reject(new Error("update profile fail"))
      }
    }
  },
};
module.exports = groupadmin_router;
