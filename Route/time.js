function userTime(){
  this.freeUsers = [];
  this.busyUsers = [];
  this.x = '';
  this.y = 0;
};

var time = {
  conver_time: function(from, to, unit) {
    if (unit > 0) {
      return Math.floor((to - from) / unit);
    }
  },

  getSchedule: function (req,res) {
    var userData = req.body.users;
    var userListData = [];
    for (let i = 0; i < userData[0].free_time.length; i++) {
      userListData[i] = new userTime();
    }
    userData.forEach(person => {
      var freeTime = person.free_time;
      for (let i = 0; i < freeTime.length; i++) {
        if (freeTime[i] === 1) {
            userListData[i].y ++;
            userListData[i].freeUsers.push(person.name);
        } else userListData[i].busyUsers.push(person.name);
      }
    });
    res.statusCode = 200;
    res.send(userListData);
  },
};
module.exports = time;
