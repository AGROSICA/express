
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

app.use(function(err, req, res, next){
  res.send(err.message, 500);
});

assert.response(app,
  { url: '/throw' },
  { body: 'keyboard cat', status: 500 });

assert.response(app,
  { url: '/next' },
  { body: 'oh noes', status: 500 });
