var device_name = "00:15:83:D1:04:C7"; // 存放 scan 後所得到的 device name
var Paperang_addr = "00:15:83:D1:04:C7"; // 存放 scan 後所得到的 device name
var font_size = 16; // PAPERANG 列印時字體大小
var base64Image = ""; // Canvas  銷貨單
function connectPrint() {
    app.preloader.show();
    connectPrint_1().then(function(message){
        return connectPrint_2();
    }).catch(function(message){
        app.preloader.hide();
        alert(message);
    }).then(function(message){
        return connectPrint_3();
    }).catch(function(message){
        app.preloader.hide();
        alert(message);
    }).then(function(message){
        $$('.startPrintBill').css("background-color" , "#007aff").removeAttr('disabled');
        app.preloader.hide();
    }).catch(function(message){
        app.preloader.hide();
        alert(message);
    })
}

function connectPrint_1(){
 return new Promise(function(resolve, reject){
     window.PaperangAPI.register(
         function(message) {
          if (message == "OK") {
             resolve("register OK");
          } else {
             reject("印表機初使化失敗111");
          }
         },
         function(error) {
             reject("印表機初使化失敗");
         }
     );
 });
};

function connectPrint_2(){
 return new Promise(function(resolve, reject){
     window.PaperangAPI.scan(
         function(message) {
          for (var key in message){
             if(key = "deviceList"){
               var obj2 = message[key];
               for (var key2 in obj2){
                  var obj3 =  obj2[key2];
                  device_name = obj3.name;
               }
             }
           }
             if (device_name != "") {
                 resolve("scan OK");
             } else {
                 reject("印表機偵測失敗");
             }
         },
         function(error) {
             reject("印表機偵測失敗");
         }
     );
 });
};

function connectPrint_3(){
 return new Promise(function(resolve, reject){
     window.PaperangAPI.connect(
        Paperang_addr,
         function(message) {
             resolve("印表機連接成功");
         },
         function(error) {
             reject("印表機連接失敗");
         }
     );
 });
};

function showBillData(){
         food_detail_bill_data = showBillDataGenData(pub_orderLists);  //
         for (var i = 0 ;i < food_detail_bill_data.length;i++) {
           var data = food_detail_bill_data[i];
         }
         showBillOnPage(); //
}

function showBillOnPage(){  // 將帳單顯示在畫面上
  genFoodDetailCanvas(food_detail_bill_data , 'kycfood/image/blank.png', function(dataUri) {
      let base64Image = "data:image/png;base64,"+dataUri;
  });
};

function showBillDataGenData(pub_orderLists){  // 產生帳單之資料
    app.preloader.show();
    var arr1 = new Array()
    var now = new Date().toLocaleString().replace(",","").replace(/:.. /," ");


    arr1.push("泰格餐飲股份有限公司台南中正分店");
    arr1.push("　　　　　結帳單　　　　　");
    arr1.push("　　　　　=====　　　　　");
    arr1.push("日期:" + now);
    arr1.push("桌次:" + pub_table);
    arr1.push("-".repeat(50)); // 分隔線　

    var total = 0;
    for (let i = 0; i < pub_orderLists.length; i++) {
        var c_amt= pub_orderLists[i].price * pub_orderLists[i].qty;
        total += c_amt;

        arr1.push(pub_orderLists[i]["name"]); // 餐點名稱
        arr1.push(pub_orderLists[i]["qty"] + "*" + pub_orderLists[i]["price"] + "=" + c_amt);
        arr1.push("-".repeat(50)); // 分隔線　
    }

       pub_toatlAmount = total ; // 訂餐總金額
       arr1.push("合計金額:" + total);


    app.preloader.hide();
    return arr1;
};

function startPrintBill(){  // 開始列印帳單
    return new Promise(function(resolve, reject){
        genFoodDetailCanvas(food_detail_bill_data , 'kycgold/image/blank.png', function(dataUri) {
               let base64Image = "data:image/png;base64,"+dataUri;
               window.PaperangAPI.print(
                  base64Image,
                   function(message) {
                       resolve("paperangPrintImage: " + message);
                   },
                   function(error) {
                       reject("paperangPrintImage Error: " + error);
                   }
               );
           });
           paperangPrintSingnature(); // 列印客戶簽名
       });
}

function genFoodDetailCanvas(data , url, callback) {
 var image = new Image();
 image.onload = function () {
    //  var wk_height = 2 + 48 ;
    var wk_height = 2  ;
    for (var i = 0 ;i < food_detail_bill_data.length;i++) {
      wk_height += font_size + 3
    }


     var canvas = document.getElementById("printCanvas");
    //  canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
     canvas.height = wk_height ; // this.naturalHeight; // or 'height' if you want a special/scaled size

     canvas.getContext('2d').drawImage(this, 0, 0);
     canvas.getContext('2d').fillStyle = '#ff0000';
     canvas.getContext('2d').font = font_size + "px Arial";
     var j = 1;

    for (var i = 0 ;i < food_detail_bill_data.length;i++) {
      let printData = food_detail_bill_data[i];
      genFoodDetailCanvasText(j,canvas.getContext('2d'),printData , "");
      j++;
    }



     callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
     callback(canvas.toDataURL('image/png'));
 };

 image.src = url;
}

function genFoodDetailCanvasText(sub_count , sub_obj, sub_name , sub_data) {
//    var wk_space = (sub_count-1)*8 + 4;
   var wk_space = (sub_count-1)*3 ;
   sub_obj.fillText(sub_name , 0  , (font_size * sub_count)+wk_space);
   if(sub_name !== ""){
     sub_obj.fillText(sub_data , 160 , (font_size * sub_count)+wk_space);
   } else {
     sub_obj.fillText(sub_data , 120 , (font_size * sub_count)+wk_space);
   }

}

function paperangPrintSingnature() {
 // var imgxx1 = "kyc/image/rose.jpeg";
 // var imgxx1 = $$('#singnatureImg2').attr("data-src");
 var image = document.getElementById('singnatureImg2');
 var imgxx1 = image.src
 toDataURL(imgxx1, function(dataUrl) {
     window.PaperangAPI.print(
         dataUrl,
             function(message) {
                 console.log("Message: " + message);
             },
             function(error) {
                 console.log("Error: " + error);
             }
     );
 })

}

function toDataURL(url, callback) {
 var httpRequest = new XMLHttpRequest();
 httpRequest.onload = function() {
    var fileReader = new FileReader();
       fileReader.onloadend = function() {
          callback(fileReader.result);
       }
       fileReader.readAsDataURL(httpRequest.response);
 };
 httpRequest.open('GET', url);
 httpRequest.responseType = 'blob';
 httpRequest.send();
}

function signature(){
 var Signature = cordova.require('nl.codeyellow.signature.Signature');
 Signature.getSignature(
     function (imgData) {
        /* This is the "success" callback. */
        screen.orientation.lock('portrait'); // 直
        if (!imgData) return; // User clicked cancel, we got no image data.
         var myCanvas = document.getElementById('myCanvas'),
         ctx = myCanvas.getContext('2d');
         myCanvas.width = imgData.width;
         myCanvas.height = imgData.height;
         ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
         ctx.putImageData(imgData, 0, 0);
         convertCanvasToImage(myCanvas);
     }, function (msg) {
        /* This is the "error" callback. */
         alert('Could not obtain a signature due to an error: '+msg);
     },
     {
         title: 'Please put your signature down below',
     });
}

function convertCanvasToImage(subCanvas) {
 var image = document.getElementById('singnatureImg2');
 image.src = subCanvas.toDataURL("image/png");
 $$('#singnatureImg2').css("display","block");
 return image;
}