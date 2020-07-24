function getDate(){
    Number.prototype.pad = function(size) {
      var s = String(this);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
    }

    var date1 = new Date();
    var year1 = date1.getFullYear().pad(4);
    var month1 = (date1.getMonth()+1).pad(2);
    var day1 = date1.getDate().pad(2);

    var hour1 = date1.getHours().pad(2);
    var minute1 = date1.getMinutes().pad(2);
    var second1 = date1.getSeconds().pad(2);
    return year1+"-"+month1+"-"+day1+" " + hour1+ ":" + minute1+":" + second1;
}