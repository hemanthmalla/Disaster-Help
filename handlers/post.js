/**
 * Created by Hemanth Malla on 02/12/15.
 */


var request = require('request');

var status_codes = require(global.__base + 'common/status_codes');
var response_utils = require(global.__base + 'common/response_utils');
var misc_utils = require(global.__base + 'common/misc_utils');
var config = require(global.__base + 'config');

var base_es = config.es_base;

exports.postApi = function(req,res,next){
    var lat = req.body.lat;
    var lon = req.body.lon;
    var tags = decodeURIComponent(req.body.tags?req.body.tags:'[]');
    var address = req.body.address;
    var locality = req.body.locality;
    var name = req.body.name;
    var title = req.body.title;
    var phone = req.body.phone;

    if(tags)tags = JSON.parse(tags);

    var data = {};
    if(title)data.title = title;
    if(name)data.name = name;
    if(address)data.address = address;
    if(locality)data.locality = locality;
    if(title)data.title = title;
    if(tags)data.tags = tags;

    if(lat && lon){
        lat = parseFloat(lat);
        lon = parseFloat(lon);
        data.location = {
            "lat":lat,
            "lon":lon
        }
    };

    request.post({
        url: base_es,
        method: "POST",
        body:JSON.stringify(data),
        time: true
    }, function (error, response, body) {

        if (error) {
            req.log.info("Error in posting : "+error);
            response_utils.respondAndLog(req,res,status_codes.FAILURE,"Failed to upload data",{});
        } else {
            req.log.info(body);
            response_utils.respondAndLog(req,res,status_codes.SUCCESS,"Updated Data",{});
        }
    });

}
