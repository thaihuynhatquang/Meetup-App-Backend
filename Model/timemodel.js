var result

// mỗi phần tử trong mảng result là một khoảng thời gian có cấu trúc như sau:
// {
//   from: Date() bắt đầu từ khi nào,
//   to:  Date() kết thúc khi nào,
//   freeMember[]: Các thành viên có thể tham dự,
// }
result=[];


// đầu vào của hàm dưới đây là một khoảng thời có cấu trúc như sau:
// {
//   username:định danh người dùng,
//   from:Date() rảnh từ khi nào,
//   to: Date() hết rảnh khi nào
// }
function addFreeTime(freeTimeObject){
  var x1= freeTimeObject.from;
  var x2= freeTimeObject.to;
    //duyệt tất cả các khung thời gian đã được thêm vào trước đó
    result.forEach(timeObj => {
        let y1= timeObj.from;
        let y2= timeObj.to;
        //xét từng trường hợp 1
        if(x1<=y1 && x2>=y2){
          // thời gian thêm vào chứa ít nhất 1 khoảng thời gian đã thêm vào trước đó
          // new: |--------|
          // old:   |-----|
          // Todo: lấy khoảng thời gian bị trùng ra khỏi mảng result, tạo thành 3 khung thời gian mới,
          // đoạn trùng ở giữa thì cập nhập số người có thể tham dự rồi add trả vào mảng kết quả
          // 2 đoạn thừa ra 2 bên đầu bản chất sẽ là 2 bài toán mới với cách làm tương tự

        }
        else if(x1<=y1 && x2>=y2){
          // thời gian thêm vào nằm hoàn toàn trong 1 khoảng thời gian đã thêm vào trước đó
          // new:   |--------|
          // old: |-----------|
          //Todo: lấy khoảng thời gian bị trùng ra khỏi mảng result, tạo thành 3 khung thời gian mới,
          // cập nhập số người có thể tham dự ở đoạn giữa rồi add cả 3 đoạn vào mảng kết quả


          break; // break ở đây vì không phải xét thêm đoạn nào nữa, vì chắc chắn các khoảng thời gian trong mảng kết quả không trùng nhau
        }

        //2 trường hợp dưới đây làm tương tự theo logic trên
        else if(x1<=y1 ** x2<=y2){
          // new:   |--------|
          // old:       |-------|

        }
        else if(x1>=y1 && x2>=y2){
          // new:   |--------|
          // old: |-------|

        }
    });
}
