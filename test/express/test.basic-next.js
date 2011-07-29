
/**
 * Module dependencies.
 */

var express = require('../../')
  , connect = require('connect')
  , assert = require('../assert');

var app = express.createServer();

app.get('/user', function(req, res, next){
  req.hits = ['/user'];
  next();
});

app.get('/user', function(req, res, next){
  req.hits.push('/user 2');
  next();
});

app.get('/:id', function(req, res, next){
  req.hits = req.hits || [];
  req.hits.push('/' + req.params.id);
  next();
});

app.get('/:id', function(req, res){
  res.send(req.hits.join(', '));
});

assert.response(app,
  { url: '/user' },
  { body: '/user, /user 2, /user' });

assert.response(app,
  { url: '/foo' },
  { body: '/foo' });

