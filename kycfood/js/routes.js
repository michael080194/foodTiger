const routes = [
  {
    path: '/',
    url: './index.html',
    on: {
      pageInit: function (e, page) {
      },
    }
  },
  {
    path: '/about/',
    templateUrl: './kycfood/pages/about.html',
    options: {context:
       {appver : "1.0",
        developer:"冠宇資訊有限公司",
        website:"michael1.cp35.secserverpros.com",
        connectType:"WiFi",
        phoneId:"xxx",
        phoneVer:"Android 7.0",
        ipAddress:"192.169.0.1",
        androidStudioVer:"V3.01",
        cordovaVer:"7.0",
        java:"1.8.0",
        Framework7:"4.0",
      }
    },
  },
  {
    path: '/settings/',
    async(to, from, resolve, reject) {
      var spreadSheetId = localStorage.spreadSheetId;
      var apiKey = localStorage.apiKey;
      var clientId  = localStorage.clientId;
      var set1 = {};
      set1.spreadSheetId = spreadSheetId
      set1.apiKey = apiKey
      set1.clientId = clientId
      resolve(
        {templateUrl: './kycfood/pages/settings.html'},
        {context: set1,}
       ); // end  resolve
    },
    on: {
      pageInit: function (e, page) {
        $$('#settings_save').on('click', function () {
          settings_save(); // settings.js
          $$('#settings001').click();
        });
      },
    }
  },
  {
    path: '/menu/',
    async(to, from, resolve, reject) {
      var data1 = {};
      data1.table = pub_table;
      data1.category = pub_category;
      data1.food = pub_food;
      data1.tabs = gen_food_tab(); // menu.js

      resolve(
        {templateUrl: './kycfood/pages/menu.html'},
        {context: data1,}
       ); // end  resolve
    },
  },
  {
    path: '/table/',
    async(to, from, resolve, reject) {
      var table  = 10 ; // localStorage.table;
      var templateDataArray = new Array();
      for(var i=1;i<=table;i++){
        var tableObj = {};
        tableObj["table"] = i;
        templateDataArray.push(tableObj);
      }
      resolve(
        {templateUrl: './kycfood/pages/table.html'},
        {context: {tableData:templateDataArray},}
       ); // end  resolve
    },
    on: {
      pageInit: function (e, page) {
        $$('.k_table').on('click', function () {
          pub_table = $$(this).attr('data-table');
          app.views.main.router.navigate("/menu/");
        });
      },
    }
  },
  {
    path: '/checkout/',
    on: {
        pageInit: function () {
            setOrderList(pub_orderLists); // checkout.js
            $$('.upload').on('click', function () { // 上傳資料
              uploadData(); // upload.js
            });
            $$('.signature').on('click', function () { // 簽名
              // signature(); // print_bill.js
              alert("signature");
            });

            $$('.connectPrint').on('click', function () { // 連接印表機
              // connectPrint(); // print_bill.js
              alert("connectPrint");
            });

            $$('.startPrintBill').on('click', function () { // 開始印表
              // startPrintBill(); // print_bill.js
              alert("startPrintBill");
            });
        }
        ,
        pageBeforeIn:function (e, page) { // 每次頁面重新載入
          showBillData(); // print_bill.js 將帳單顯示在畫面上
        },
    },
    // 記錄點餐細項
    async (routeTo, routeFrom, resolve, reject) {
        if ($$('.total-price').text() !== '0') {
            prepareCheckout(pub_orderLists); // checkout.js
            resolve({
                url: './kycfood/pages/checkout.html'
            })
        } else {
            toastCheckout.open();
            reject();
        }
    }
  },
  {
    path: '(.*)',
    url: './kycfood/pages/404.html',
  },
];

