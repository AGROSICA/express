
/**
 * Module dependencies.
 */

var express = require('../../')
  , connect = require('connect')
  , should = require('should')
  , assert = require('../assert');

var app = express.createServer();

// .set()
var app = express.createServer();
var ret = app.set('title', 'My App').set('something', 'else');
ret.should.equal(app);
app.set('title').should.equal('My App');
app.set('something').should.equal('else');

// .settings
var app = express.createServer();
app.set('title', 'My App');
app.settings.title.should.equal('My App');
app.settings.title = 'Something Else';
app.settings.title.should.equal('Something Else');
app.set('title').should.equal('Something Else');

// .enable()
var app = express.createServer();
var ret = app.enable('some feature');
ret.should.equal(app);
app.set('some feature').should.be.true;
app.enabled('some feature').should.be.true;
app.enabled('something else').should.be.false;

// .disable()
var app = express.createServer();
var ret = app.disable('some feature');
ret.should.equal(app);
app.set('some feature').should.be.false;
app.disabled('some feature').should.be.true;
app.disabled('something else').should.be.true;
