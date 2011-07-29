
/**
 * Module dependencies.
 */

var express = require('../../')
  , connect = require('connect')
  , should = require('should')
  , assert = require('../assert');

var app = express.createServer();

app.get('/', function(req, res){
  app.set('env').should.equal('test');
  res.writeHead(200, {});
  res.end('wahoo');
});

app.put('/user/:id', function(req, res){
  res.writeHead(200, {});
  res.end('updated user ' + req.params.id)
});

app.del('/something', function(req, res){
  res.send('Destroyed');
});

app.delete('/something/else', function(req, res){
  res.send('Destroyed');
});

app.all('/staff/:id', function(req, res, next){
  req.staff = { id: req.params.id };
  next();
});

app.get('/staff/:id', function(req, res){
  res.send('GET Staff ' + req.staff.id);
});

app.post('/staff/:id', function(req, res){
  res.send('POST Staff ' + req.staff.id);
});

app.all('*', function(req, res){
  res.send('requested ' + req.url);
});

assert.response(app,
  { url: '/' },
  { body: 'wahoo' });

assert.response(app,
  { url: '/user/12', method: 'PUT' },
  { body: 'updated user 12' });

assert.response(app,
  { url: '/something', method: 'DELETE' },
  { body: 'Destroyed' });

assert.response(app,
  { url: '/something/else', method: 'DELETE' },
  { body: 'Destroyed' });

assert.response(app,
  { url: '/staff/12' },
  { body: 'GET Staff 12' });

assert.response(app,
  { url: '/staff/12', method: 'POST' },
  { body: 'POST Staff 12' });

assert.response(app,
  { url: '/foo/bar/baz', method: 'DELETE' },
  { body: 'requested /foo/bar/baz' });
