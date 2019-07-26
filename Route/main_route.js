var jsonParser = require('body-parser').json(); // nhận json từ client
var user_route = require('./user_route');
var groupadmin_route = require('./groupadmin_route');

module.exports = {
  route: function(app) {
    app.get('/', (req, res) => res.send('Hello, I am OK now!'));
    app.post('/user/auth', jsonParser, (req, res) => user_route.auth(req, res));
    app.post(
      '/user/loginWithGoogle',
      jsonParser,
      (req, res) => user_route.loginGoogle(req, res), // To Do: trong ham loginGoole, neu user chua ton tai thi phai set them cac thuoc tinh mac dinh cua user nhu location, groups[], meetings[] (chua lam)
    );
    //To Do
    app.post('/user/FreeTimeForGroup', jsonParser, (req, res) => user_route.setFreeTimeForGroup(req, res));
    app.patch('/user/profile', jsonParser, (req, res) => user_route.updateProfile(req, res)); // lam duoc thi tot
    app.get('/user/profile', (req, res) => user_route.getProfile(req, res)); // lam duoc thi tot
    app.get('/user/notify', (req, res) => user_route.getNotify(req, res)); // lam duoc thi tot

    app.post('/group/createGroup', jsonParser, (req, res) => groupadmin_route.createGroup(req, res));
    app.patch('/group/updateGroupInfo', jsonParser, (req, res) => groupadmin_route.updateGroupInfo(req, res)); //update cac thong tin group
    app.patch('/group/updateGroupMembers', jsonParser, (req, res) => groupadmin_route.updateGroupMembers(req, res)); // them, sua, xoa member sau do gui lai danh sach member vao api nay
    app.get('/group/members_time', (req, res) => groupadmin_route.getMembersTime(req, res)); //lay du lieu thong ke de show graph
    app.post('/group/createMeeting', jsonParser, (req, res) => groupadmin_route.createMeeting(req, res)); // tao meeting moi ( sau khi da xem thong ke)
  },
};
