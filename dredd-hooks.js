var hooks = require('hooks');


// remove charset from expected and real headers
// see the transaction object documentation:
// http://dredd.org/en/latest/data-structures.html#transaction
// console.log('hooks loaded')
hooks.beforeEachValidation(function (transaction) {
    //console.log(transaction)
    //console.log('hook triggered')

    // content-type extracted from the api spec and expected to equal response content-type header
    if(transaction['expected']['headers']['Content-Type'].indexOf('charset') > -1){
      noCharsetContentType = transaction['expected']['headers']['Content-Type'].split(";")[0]
      transaction['expected']['headers']['Content-Type'] = noCharsetContentType    
    }
    
    // real response content-type sent from the server
     if(transaction['real']['headers']['content-type'].indexOf('charset') > -1){
      noCharsetContentType = transaction['real']['headers']['content-type'].split(";")[0]
      transaction['real']['headers']['content-type'] = noCharsetContentType    
    }
});
