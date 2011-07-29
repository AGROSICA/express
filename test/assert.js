
/**
 * Module dependencies.
 */

var assert = require('assert')
  , http = require('http');

module.exports = assert;

assert.response = function(app, req, res){
  console.log(req);
};