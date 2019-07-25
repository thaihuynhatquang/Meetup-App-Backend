var jsonParser = require("body-parser").json(); // nhận json từ client
var user_route = require("./user_route");

module.exports = {
  route: function(app) {
    app.get("/", (req, res) => res.send("Hello, I am OK now!"));
    app.post("/user/auth", jsonParser, (req, res) => user_route.auth(req, res));
    app.post("/user/loginWithGoogle", jsonParser, (req, res) =>
      user_route.loginGoogle(req, res)
    );
  }
};
