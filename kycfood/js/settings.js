function settings_save(){ //儲存 系統設定參數
 localStorage.spreadSheetId = $$('.page[data-name="settings"] input[name="spreadSheetId"]').val(); // google試算表ID
 localStorage.apiKey = $$('.page[data-name="settings"] input[name="apiKey"]').val(); // google sheet API KEY
 localStorage.clientId = $$('.page[data-name="settings"] input[name="clientId"]').val(); // OAuth 憑證
}

function setupRestore(){ //儲存 系統設定參數
 var spreadSheetId = localStorage.spreadSheetId;//google試算表ID
 var apiKey = localStorage.apiKey; // google sheet API KEY
 var clientId = localStorage.clientId; // OAuth 憑證
}