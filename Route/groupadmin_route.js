var db = require("../Model/database");
const secure = require("./secure");
var verifier = require("google-id-token-verifier");
var androidId = require("./key").google.androidID;
var iosId = require("./key").google.iosID;

var groupadmin_router = {

};
module.exports = groupadmin_router;