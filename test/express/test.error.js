
/**
 * Module dependencies.
 */

var express = require('../../')
  , connect = require('connect')
  , assert = require('../assert');

var app = express.createServer();

app.get('/', function(req, res, next){
  throw new Error('keyboard cat');
});

app.use(function(err, req, res, next){
  throw new Error('error handler broke');
});

app.use(function(err, req, res, next){
  res.send(err.message, 500);
});

assert.response(app,
  { url: '/' },
  { body: 'error handler broke', status: 500 });