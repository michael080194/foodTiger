function uploadData(event) {
  // gapi.auth2.getAuthInstance().signIn();
  uploadDataGetLastRow("order_head");
  // uploadDataGetLastRow("order_detail");
  // console.log("currentHeadLast=" + currentHeadLast);
  // console.log("currentDetailLast=" + currentDetailLast);
}


function uploadDataGetLastRow(dataType) {
  var params = {
    spreadsheetId: pub_spreadsheetId,
    range: dataType,  // TODO: Update placeholder value.
  };

  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response) {
    // var uploadData = [];
    if(dataType == "order_head"){
      var fulldate = getDateType("fullDate"); // 取得的格式 2020-07-21 11:13:05
      var briefdate = getDateType("briefDate1"); // 西元年取後二碼 2020-07-21 return 200721

      var currentHeadLast = response.result.values;
      var lastNo =currentHeadLast[currentHeadLast.length-1][0];
      var newNo = uploadDataGetNewOrderNo(lastNo); // 將 0033 變成 0034
      var pub_newOrderNo = briefdate + "-" + newNo;

      uploadData = [[pub_newOrderNo , fulldate , pub_table+"號桌" , pub_toatlAmount , ""]];

      uploadDataWriteToGoogleSheet(dataType , currentHeadLast.length , uploadData);
    }
    
    if(dataType == "order_detail"){
      for (let i = 0; i < pub_orderLists.length; i++) {
          var arr1 = [];
          var amt = pub_orderLists[i].price * pub_orderLists[i].qty;
          arr1.push([
            pub_newOrderNo,
            i+1,
            pub_orderLists[i]["partno"],
            pub_orderLists[i]["name"],
            pub_orderLists[i]["unit"],
            pub_orderLists[i]["qty"],
            pub_orderLists[i]["price"],
            amt
          ]);
          uploadData.push(arr1);
      }
      console.log(uploadData);
      var currentDetailLast = response.result.values;
      uploadDataWriteToGoogleSheet(dataType , currentDetailLast.length , uploadData);
    }
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

function uploadDataWriteToGoogleSheet(dataType,lastRow,uploadData) {
  var params = {
    spreadsheetId: pub_spreadsheetId,
    "range": "order_head!A"+lastRow , // 例如 order_head!A34
    valueInputOption: 'USER_ENTERED',
  };

  var valueRangeBody = {
    "majorDimension": "ROWS",
    "values": uploadData,
  };


  var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
  request.then(function(response) {
    console.log(response.result);
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

function uploadDataWriteToDetail(dataType,lastRow) {
  var params = {
    spreadsheetId: pub_spreadsheetId,
    "range": "order_!A"+lastRow ,
    valueInputOption: 'USER_ENTERED',
  };

  var valueRangeBody = {
    "majorDimension": "ROWS",
    "values": [
      ["new_Item", "Cost", "Stocked", "Ship Date"],
      ["new_Wheel", "$20.50", "4", "3/1/2016"],
      ["new_Door", "$15", "2", "3/15/2016"],
      ["new_Engine", "$100", "1", "3/20/2016"],
      ["new_Totals", "=SUM(B2:B4)", "=SUM(C2:C4)", "=MAX(D2:D4)"]
    ],
  };


  var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
  request.then(function(response) {
    console.log(response.result);
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

// 將 0033 變成 0034
function uploadDataGetNewOrderNo(lastNo){
  var NewArray = lastNo.split("-");
  var num1 = parseInt(NewArray[1]) ; // 字串轉成數字
  var newNo = (num1+1).pad(4); // 變成 0034
  return  newNo;
}

function getDateType(dateType){
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

  switch (dateType) {
      case 'fullDate': // 取得的格式 2020-07-21 11:13:05
          return year1+"-"+month1+"-"+day1+" " + hour1+ ":" + minute1+":" + second1;
          break;
      case 'briefDate1': // 西元年取後二碼 2020-07-21 return 200721
          return year1.substring(0, 2)+month1+day1;
          break;
      default:
          alert('沒有符合日期格式');
          return "";
  }

}