
/**
 * Module dependencies.
 */

var express = require('../../')
  , connect = require('connect')
  , should = require('should')
  , assert = require('../assert');

var app = express.createServer();

app.configure(function(){
  app.get('/all', function(req, res){ res.send(200); });
});

app.configure('production', function(){
  app.get('/prod', function(req, res){ res.send(200); });
});

app.configure('development', function(){
  app.get('/dev', function(req, res){ res.send(200); });
});

app.configure('test', function(){
  app.get('/test', function(req, res){ res.send(200); });
});

app.configure('test', function(){
  app.get('/test2', function(req, res){ res.send(200); });
});

app.configure(function(){
  app.get('/all2', function(req, res){ res.send(200); });
});

assert.response(app,
  { url: '/all' },
  { status: 200 });

assert.response(app,
  { url: '/all2' },
  { status: 200 });

assert.response(app,
  { url: '/test' },
  { status: 200 });

assert.response(app,
  { url: '/test2' },
  { status: 200 });
