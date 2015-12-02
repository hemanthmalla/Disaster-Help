/**
 * Created by Hemanth Malla on 02/12/15.
 */

var express = require('express');
var router = express.Router();

var postHandler = require(global.__base + 'handlers/post');
var searchHandler = require(global.__base + 'handlers/search');


router.post('/post/',postHandler.postApi);
router.get('/search/',searchHandler.searchApi);

module.exports = router;
