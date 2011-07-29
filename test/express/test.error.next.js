
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

assert.response(app,
  { url: '/throw' },
  { body: '', status: 500 });
