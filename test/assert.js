
/**
 * Module dependencies.
 */

var assert = require('assert')
  , http = require('http');

module.exports = assert;

assert.response = function(app, req, res){
  if (app.fd) return assertResponse(app, req, res);
  app.listen(0, function(){
    assertResponse(app, req, res);
  });
};

function fail(title, expected, actual) {
  console.log(' %s\n    Expected: %s\n    Got: %s', title, expected, actual);
}

function assertResponse(app, req, res) {
  req.method = req.method || 'GET';
  res.status = res.status || 200;

  // http request
  var request = http.request({
      host: '127.0.0.1'
    , port: app.address().port
    , path: req.url
    , method: req.method
    , headers: req.headers
  });

  // write given data
  if (req.data) request.write(data);

  request.on('response', function(response){
    response.body = '';
    response.setEncoding('utf8');
    response.on('data', function(chunk){ response.body += chunk; });
    response.on('end', function(){
      // response body
      if (null !== res.body) {
        var ok = res.body instanceof RegExp
          ? res.body.test(response.body)
          : res.body === response.body;
        if (!ok) fail('Invalid response body.', res.body, response.body);
      }
      // Assert response body
      if (res.body !== undefined) {
          var eql = res.body instanceof RegExp
            ? res.body.test(response.body)
            : res.body === response.body;
          assert.ok(
              eql,
              msg + 'Invalid response body.\n'
                  + '    Expected: ' + sys.inspect(res.body) + '\n'
                  + '    Got: ' + sys.inspect(response.body)
          );
      }
    });
  });
}

