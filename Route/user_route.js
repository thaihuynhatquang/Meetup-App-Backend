var db = require("../Model/database");
const secure = require("./secure");
var verifier = require("google-id-token-verifier");
var androidId = require("./key").google.androidID;
var iosId = require("./key").google.iosID;

var user_router = {
  auth: function(req, res) {
    var token = req.body.token;
    if (secure.verifyUserToken(token)) {
      res.statusCode = 200;
      res.send(req.body.favorite);
    } else {
      res.statusCode = 401;
      res.send("Unauthenticated");
    }
  },
  loginGoogle: function(req, res) {
    var clientId = req.body.platform == "ios" ? iosId : androidId;
    verifier.verify(req.body.token, clientId, function(err, tokenInfo) {
      if (!err) {
        db.getUser(tokenInfo.email)
          .then(r => {
            console.log(r);
            let x = secure.createUserToken({
              u: r.username,
              n: r.name
            });
            res.statusCode = 200;
            res.send(
              JSON.stringify({
                username: r.username,
                token: x,
                name: r.name,
                avatar: r.avatar,
                favorite: r.favorite
              })
            );
          })
          .catch(e => {
            // user chưa tồn tại
            let newuser = {
              avatar: tokenInfo.picture,
              name: tokenInfo.name,
              // listBannedWebSite: [],
              username: tokenInfo.email,
              dark: tokenInfo.sub
            };
            db.addUser(newuser)
              .then(id => {
                let x = secure.createUserToken({
                  u: tokenInfo.email,
                  n: tokenInfo.name
                });
                res.statusCode = 200;
                res.send(
                  JSON.stringify({
                    username:tokenInfo.email,
                    token: x,
                    name: tokenInfo.name,
                    avatar: tokenInfo.picture
                  })
                );
              })
              .catch(e => {
                console.log(e);
                res.statusCode = 401;
                res.send();
              });
          });
      } else {
        res.statusCode = 401;
        res.send();
      }
    });
  }
};
module.exports = user_router;
// var res={t:"eyJhbGciOiJSUzI1NiIsImtpZCI6IjI4ZjU4MTNlMzI3YWQxNGNhYWYxYmYyYTEyMzY4NTg3ZTg4MmI2MDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDA2ODg4MjIwMDQwLTN2dWExc3QwZHFhcmcxdGxua2diZTE1amUxbTk5bmw1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTAwNjg4ODIyMDA0MC0zdnVhMXN0MGRxYXJnMXRsbmtnYmUxNWplMW05OW5sNS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNDA4NjY0MzMxODczNDM5NDE0MyIsImVtYWlsIjoidHJhbnF1YW5nbGluaC5wdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InJxa0JwS3p5N0Z4aFpOSmZtTHBJTkEiLCJuYW1lIjoiUXVhbmcgTGluaCBUcuG6p24iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1iVDVQNkliUWF3Yy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3Jmdm9UeHhlclQ0b09KTm9GNUQ4QzJXX3F6cHN3L3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJRdWFuZyBMaW5oIiwiZmFtaWx5X25hbWUiOiJUcuG6p24iLCJsb2NhbGUiOiJ2aSIsImlhdCI6MTU1NzM4ODQ1NiwiZXhwIjoxNTU3MzkyMDU2fQ.gv4tMT6DC_rD5qAaEVzpW36lGLgwYnOk0TqH_jT1coQg02RnI3Sny4ajVTSGyYV9epbRwtbXvZuCHCcBuYfq1CpSL1-IDQdl5ca5FnT7pKB2MKv7CiMV1ocl-33xjddH_1R2k9lvBENgC-lpy_wCKQB5U2b90caTGZZ4A7wkbIe78J8h6SlHu-WLHZqdcMTV_hJ1Sn0eSgeYuv0msr8-GuzabLnp5UzAKz1eqXleYNEbGBeveK1TKC2Ok8qSJRlW10c1MauVvSkMITOJE33QAWsXPYKhICOFCeBzIQ0zuYf-Bgu_EIALnXYzTAy2h5h-wVhg_Lmf0BOFX4eiOVQQCw"}
// var x={};
// x.body=res;
// user_router.loginG(x,null);
