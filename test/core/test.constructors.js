
/**
 * Module dependencies.
 */

var express = require('../../')
  , connect = require('connect')
  , should = require('should');

// exports

express.should.have.property('HTTPServer');
express.should.have.property('HTTPSServer');
express.should.have.property('Route');
express.should.have.property('View');

// auto-exporting of middleware

express.errorHandler.should.equal(connect.errorHandler);
express.session.should.equal(connect.session);