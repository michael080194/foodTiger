// import Home from './index_gold.html'

function onLoad() {
  //  Cordova加載完成會觸發
  document.addEventListener("deviceready", onDeviceReady , false);
  handleClientLoad();
}

function onDeviceReady(){
  device_version = device.version;
  device_uuid = device.uuid;
  device_platform = device.platform;
}

// Dom7
var $$ = Dom7;

// Framework7 App main instance
app  = new Framework7({
  init: false,
  root: '#app', // App root element
  view:{
    // ex domCache
    stackPages:true,
    // looks better with js
    animateWithJS:true
  },
  id: 'com.kyc168.repair', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  routes: routes,
});

$$(document).on('page:init', function (e) {
  var page = e.detail;
  // console.log(e.detail.name);
});

app.init();
// console.log(app.views);
var mainView = app.views.create('.view-main');


var spreadSheetId = localStorage.spreadSheetId;
var apiKey = localStorage.apiKey;
var clientId  = localStorage.clientId;


$$('.login-button').on('click', function () {
  handleSignInClick();
  // gapi.auth2.getAuthInstance().signIn();
  // app.views.main.router.navigate("/main/");
  // return ;
});

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  var API_KEY = pub_googleAPIkey;
  var CLIENT_ID = pub_clientID;
  // TODO: Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/drive.readonly'
  //   'https://www.googleapis.com/auth/spreadsheets'
  //   'https://www.googleapis.com/auth/spreadsheets.readonly'
  var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

  gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    // alert("init gapi successful !!");
    // gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    // updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}


function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    makeApiCall();
  }
}

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
  // makeApiCall("food_category");
  // makeApiCall("food");

  app.views.main.router.navigate("/table/");
}

function makeApiCall(dataType) {
  var params = {
    spreadsheetId: pub_spreadsheetId,
    range: dataType,  // TODO: Update placeholder value.
  };

  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response) {
    if(dataType == "food_category"){
      pub_category = response.result.values;
    }
    if(dataType == "food"){
      pub_food = response.result.values;
    }
    // var last_row = response.result.values.length;
    // console.log("show last_row:" + last_row);
  }, function(reason) {
     alert(dataType + ' error:\n' + reason.result.error.message);
  });
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}




