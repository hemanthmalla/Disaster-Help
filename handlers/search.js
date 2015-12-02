/**
 * Created by Hemanth Malla on 02/12/15.
 */

"use strict";
var request = require('request');

var status_codes = require(global.__base + 'common/status_codes');
var response_utils = require(global.__base + 'common/response_utils');
var misc_utils = require(global.__base + 'common/misc_utils');
var config = require(global.__base + 'config');

var base_es = config.es_base;

exports.searchApi = function(req,res,next){
    var lat = req.query.lat;
    var lon = req.query.lon;
    var tags = decodeURIComponent(req.body.tags?req.body.tags:'[]');
    var address = req.body.address;
    var locality = req.body.locality;
    var name = req.body.name;
    var title = req.body.title;

    if(tags)tags = JSON.parse(tags);

    var data = {};
    if(title)data.title = title;
    if(name)data.name = name;
    if(address)data.address = address;
    if(locality)data.locality = locality;
    if(title)data.title = title;

    if(lat && lon){
        lat = parseFloat(lat);
        lon = parseFloat(lon);
    }
    var query = {
      "sort": [
        {
          "_geo_distance": {
            "location": {
                "lat": lat,
                "lon": lon
            },
            "order": "asc",
            "unit": "km",
            "distance_type": "plane"
          }
        }
      ]
    };

    request({
        url: base_es + "_search/",
        method: "POST",
        body:JSON.stringify(query),
        time: true
    }, function (error, response, body) {

        if (error) {
            req.log.info("Error in fetching data : "+error);
            response_utils.respondAndLog(req,res,status_codes.FAILURE,"Failed to fetch data",{});
        } else {
            var data = JSON.parse(body);
            var results = data["hits"]["hits"];
            var fin_results = [];
            for(var i=0;i<results.length;i++){
                var r = results[i]['_source'];
                var result = {};
                result.title = r.title ? r.title : "";
                result.address = r.address ? r.address : "";
                result.name = r.name ? r.name : "";
                result.phone = r.phone ? r.phone : "";
                result.tags = r.tags ? r.tags : [];
                result.locality = r.locality ? r.locality : "";
                result.location = r.location ? r.location : {};
                var sort_data = results[i]['sort'];
                if(sort_data && sort_data.length>0)result.distance = sort_data[0];
                fin_results.push(result);
            }
            response_utils.respondAndLog(req,res,status_codes.SUCCESS,fin_results,{});
        }
    });

}
