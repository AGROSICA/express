
/**
 * Module dependencies.
 */

var express = require('express')
  , connect = require('connect')
  , assert = require('assert')
  , should = require('should')
  , Route = express.Route;

module.exports = {
  'test #configure()': function(beforeExit){
    var calls = [];
    var server = express.createServer();
    server.set('env', 'development');
    
    var ret = server.configure(function(){
      assert.equal(this, server, 'Test context of configure() is the server');
      calls.push('any');
    }).configure('development', function(){
      calls.push('dev');
    }).configure('production', function(){
      calls.push('production');
    });

    should.equal(ret, server, 'Test #configure() returns server for chaining');

    assert.response(server,
        { url: '/' },
        { body: 'Cannot GET /' });

    beforeExit(function(){
      calls.should.eql(['any', 'dev']);
    });
  },
  
  'test #configure() immediate call': function(){
    var app = express.createServer();

    app.configure(function(){
      app.use(connect.bodyParser());
    });
    
    app.post('/', function(req, res){
      res.send(req.param('name') || 'nope');
    });

    assert.response(app,
      { url: '/', method: 'POST', data: 'name=tj', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }},
      { body: 'tj' });
  },

  'test #configure() precedence': function(){
    var app = express.createServer();

    app.configure(function(){
      app.use(function(req, res, next){
        res.writeHead(200, {});
        res.write('first');
        next();
      });
      app.use(app.router);
      app.use(function(req, res, next){
        res.end('last');
      });
    });
    
    app.get('/', function(req, res, next){
      res.write(' route ');
      next();
    });

    assert.response(app,
      { url: '/' },
      { body: 'first route last' });
  },

  'test #configure() multiple envs': function(){
    var app = express.createServer();
    app.set('env', 'prod');
    var calls = [];

    app.configure('stage', 'prod', function(){
      calls.push('stage/prod');
    });

    app.configure('prod', function(){
      calls.push('prod');
    });

    calls.should.eql(['stage/prod', 'prod']);
  },

  'test #set()': function(){
    var app = express.createServer();
    var ret = app.set('title', 'My App').set('something', 'else');
    ret.should.equal(app);
    app.set('title').should.equal('My App');
    app.set('something').should.equal('else');
  },

  'test .settings': function(){
    var app = express.createServer();
    app.set('title', 'My App');
    app.settings.title.should.equal('My App');
    app.settings.title = 'Something Else';
    app.settings.title.should.equal('Something Else');
    app.set('title').should.equal('Something Else');
  },
  
  'test #enable()': function(){
    var app = express.createServer();
    var ret = app.enable('some feature');
    ret.should.equal(app);
    app.set('some feature').should.be.true;
    app.enabled('some feature').should.be.true;
    app.enabled('something else').should.be.false;
  },
  
  'test #disable()': function(){
    var app = express.createServer();
    var ret = app.disable('some feature');
    ret.should.equal(app);
    app.set('some feature').should.be.false;
    app.disabled('some feature').should.be.true;
    app.disabled('something else').should.be.true;
  },
  
  'test mounting': function(){
    var called
      , app = express.createServer()
      , blog = express.createServer()
      , map = express.createServer()
      , reg = connect.createServer();

    map.set('home', '/map');
    
    map.mounted(function(parent){
      called = true;
      assert.equal(this, map, 'mounted() is not in context of the child app');
      assert.equal(app, parent, 'mounted() was not called with parent app');
    });

    reg.use(function(req, res){ res.end('hey'); });
    app.use('/regular', reg);

    app.use('/blog', blog);
    app.use('/contact', map);
    blog.route.should.equal('/blog');
    map.route.should.equal('/contact');
    should.equal(true, called);

    app.set("test", "parent setting");
    blog.set('test').should.equal('parent setting');
    
    app.get('/', function(req, res){
      app.set('home').should.equal('/');
      blog.set('home').should.equal('/blog');
      map.set('home').should.equal('/contact/map');
      res.send('main app');
    });

    blog.get('/', function(req, res){
      res.send('blog index');
    });
    
    blog.get('/post/:id', function(req, res){
      res.send('blog post ' + req.params.id);
    });
    
    assert.response(app,
      { url: '/' },
      { body: 'main app' });
    assert.response(app,
      { url: '/blog' },
      { body: 'blog index' });
    assert.response(app,
      { url: '/blog/post/12' },
      { body: 'blog post 12' });
    assert.response(blog,
      { url: '/' },
      { body: 'blog index' });
    assert.response(app,
      { url: '/regular' },
      { body: 'hey' });
  },

  'test .app property after returning control to parent': function() {
    var app = express.createServer()
      , blog = express.createServer();

    // Mounted servers did not restore `req.app` and `res.app` when
    // passing control back to parent via `out()` in `#handle()`.

    blog.get('/', function(req, res, next){
      req.app.should.equal(blog);
      res.app.should.equal(blog);
      next();
    });

    app.use(blog);

    app.use(function(req, res, next) {
      res.send((res.app === app) ? 'restored' : 'not-restored');
    });

    assert.response(app,
      { url: '/' },
      { body: 'restored' }
    );
  },
  
  'test routes with same callback': function(){
    function handle(req, res) {
      res.send('got ' + req.string);
    }

    var app = express.createServer();

    app.get('/', function(req, res, next){
      req.string = '/';
      next();
    }, handle);

    app.get('/another', function(req, res, next){
      req.string = '/another';
      next();
    }, handle);

    assert.response(app,
      { url: '/' },
      { body: 'got /' });

    assert.response(app,
      { url: '/another' },
      { body: 'got /another' });
  },
  
  'invalid chars': function(){
    var app = express.createServer();

    app.get('/:name', function(req, res, next){
      res.send('invalid');
    });

    assert.response(app,
      { url: '/%a0' },
      { status: 500 });
  }
};
