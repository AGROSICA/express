
/**
 * Module dependencies.
 */

var express = require('../../')
  , connect = require('connect')
  , assert = require('../assert');

var app = express.createServer();

app.get('/throw', function(req, res, next){
  throw new Error('keyboard cat');
});

app.get('/next', function(req, res, next){
  next(new Error('oh noes'));
});

assert.response(app,
  { url: '/next' },
  { body: /^Error: oh noes/, status: 500 });
