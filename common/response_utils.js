var status_codes = require("./status_codes")

exports.create_return_dict = function(status_code,data,extra){
    status_code = typeof status_code !== 'undefined' ? status_code : status_codes.FAILURE;
    data = typeof data !== 'undefined' ? data : {};
    extra = typeof extra !== 'undefined' ? extra : {};
    return_dict = {
        'message': status_code.message,
        'code': status_code.status,
        'data': data,
        'extra': extra
    }
    return return_dict
};

exports.respondAndLog = function(req,res,status_code,data,extra){
    status_code = typeof status_code !== 'undefined' ? status_code : status_codes.FAILURE;
    data = typeof data !== 'undefined' ? data : {};
    extra = typeof extra !== 'undefined' ? extra : {};
    return_dict = {
        'message': status_code.message,
        'code': status_code.status,
        'data': data,
        'extra': extra
    };
    res.json(return_dict);
    var data = {};
    var lat = req.query.lat;
    var long = req.query.long;

    data.code = status_code.status;
    data.timeTaken = new Date - req.startTime;
    data.ips = req.ips;
    if((lat != undefined) && (long != undefined))data.deviceLocation = [parseFloat(lat),parseFloat(long)];
    req.log.info(data, "Responding with : ");
};
