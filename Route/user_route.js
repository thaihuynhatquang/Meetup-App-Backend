var db = require('../Model/database');
const secure = require('./secure');
var verifier = require('google-id-token-verifier');
var androidId = require('./key').google.androidID;
var iosId = require('./key').google.iosID;

var user_router = {
  auth: function(req, res) {
    var token = req.headers.authorization;
    if (secure.verifyUserToken(token)) {
      const userName = secure.verifyUserToken(token).u;
      db.getCurrentUser(userName)
        .then((result) => {
          res.statusCode = 200;
          res.send(result);
        })
        .catch((error) => {
          console.log(error);
          res.statusCode = 401;
          res.send();
        });
    } else {
      res.statusCode = 401;
      res.send('Unauthenticated');
    }
  },
  loginGoogle: function(req, res) {
    var clientId = req.body.platform == 'ios' ? iosId : androidId;
    verifier.verify(req.body.token, clientId, function(err, tokenInfo) {
      if (!err) {
        let newUser = {
          avatar: tokenInfo.picture,
          name: tokenInfo.name,
          userName: tokenInfo.email,
          dark: tokenInfo.sub,
        };

        db.manageUser(newUser)
          .then((result) => {
            let token = secure.createUserToken({
              u: result.userName,
              n: result.name,
            });
            res.statusCode = 200;
            res.send({ token: token });
          })
          .catch((error) => {
            console.log(error);
            res.statusCode = 401;
            res.send();
          });
      } else {
        res.statusCode = 401;
        res.send();
      }
    });
  },
  getUsers: function(req, res) {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      // token không xác thực được
      res.statusCode = 401;
      res.send('Không xác thực được người dùng');
    } else {
      db.getUsers()
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((error) => {
          console.log(error);
          res.statusCode = 401;
          res.send();
        });
    }
  },
  setFreeTime: function(req, res) {
    fretime;
  },
  getProfile: async function(req, res) {
    var uid = req.params.uid;
    db.getUserProfile(uid)
      .then((r) => res.status(200).send(r))
      .catch((e) => console.log(e));
  },
};
module.exports = user_router;
