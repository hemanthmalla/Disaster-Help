var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'chennai_resuce'});
var config = require(global.__base + 'config');

exports.check_for_null = function() {
    for(var i=0;i<arguments.length;i++){
        if(arguments[i] == undefined){
            log.info("index of param missing"+i);
            return 1;
        }
    }
    return 0;
};

exports.create_error = function(message,obj,err){
    if(err)err.message = err.message + "\n" + message;
    else{
        err = new Error(message);
    }
    err.title = obj.title;
    err.code = obj.status;
    err.details = obj.message;
    return err;
}
