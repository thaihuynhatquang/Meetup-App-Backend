
// function createSchedule(){
//   result[];
//   // duyet nguoi dung
//     // duyet tat ca freetime
//           result = addFreeTime(freeTimeObject);
// }


// var result

// // mỗi phần tử trong mảng result là một khoảng thời gian có cấu trúc như sau:
// // {
// //   from: Date() bắt đầu từ khi nào,
// //   to:  Date() kết thúc khi nào,
// //   freeMembers[]: Các thành viên có thể tham dự,
// // }
// result=[];


// đầu vào của hàm dưới đây là một khoảng thời có cấu trúc như sau:
// {
//   name:định danh người dùng,
//   from:Date() rảnh từ khi nào,
//   to: Date() hết rảnh khi nào
// }
function addFreeTime(freeTimeObject, result){
  if(result.length == 0) {
    freeTimeObject.freeMembers=[freeTimeObject.name];
    delete(freeTimeObject.name);
    result.push(freeTimeObject)
    return result;
  }
  //
  let x1= freeTimeObject.from;
  let x2= freeTimeObject.to;
  let name = freeTimeObject.name;
    //duyệt tất cả các khung thời gian đã được thêm vào trước đó
    result.forEach(timeObj => {
        let y1= timeObj.from;
        let y2= timeObj.to;
        //xét từng trường hợp 1
        if(x1<=y1 && x2>=y2){
          // thời gian thêm vào chứa ít nhất 1 khoảng thời gian đã thêm vào trước đó
          // new(x): |---------|--|
          // old(y):   |-----| |------|}
          // Todo: lấy khoảng thời gian bị trùng ra khỏi mảng result, tạo thành 3 khung thời gian mới,
          // đoạn trùng ở giữa thì cập nhập số người có thể tham dự rồi add trả vào mảng kết quả
          // 2 đoạn thừa ra 2 bên đầu bản chất sẽ là 2 bài toán mới với cách làm tương tự
          let oldMembers=timeObj.freeMembers;
          delete(timeObj);
          let fragment1 = {
            from:x1,
            to:y1,
            freeMembers:oldMembers
          }
          result.push(fragment1);

          oldMembers.push(name);
          let fragment2 ={
            from:y1,
            to:y1,
            freeMembers:oldMembers
          }
          result.push(fragment2);

          let fragment3={
            from:y2,
            to:x2,
            name:name
          }
          this.addFreeTime(fragment3);
        }
        else if(x1>=y1 && x2<=y2){
          // thời gian thêm vào nằm hoàn toàn trong 1 khoảng thời gian đã thêm vào trước đó
          // new(x):   |--------|
          // old(y): |-----------|
          //Todo: lấy khoảng thời gian bị trùng ra khỏi mảng result, tạo thành 3 khung thời gian mới,
          // cập nhập số người có thể tham dự ở đoạn giữa rồi add cả 3 đoạn vào mảng kết quả


          break; // break ở đây vì không phải xét thêm đoạn nào nữa, vì chắc chắn các khoảng thời gian trong mảng kết quả không trùng nhau
        }

        //2 trường hợp dưới đây làm tương tự theo logic trên
        else if(x1<=y1 && x2<=y2){
          // new(x):   |--------|
          // old(y):       |-------|

        }
        else if(x1>=y1 && x2>=y2){
          // new(x):   |--------|
          // old(y): |-------|

        }else{
          // new(x):             |--------|
          // old(y): |-------|
          // hoặc ngược lại
          let newTimeObj={
            from:x1,
            to:x2,
            freeMembers:[name]
          }
          result.push(newTimeObj);
        }
    });
}

