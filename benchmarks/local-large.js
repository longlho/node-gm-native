'use strict';
var fs = require('fs')
  , im = require('../index')
  , Benchmark = require('benchmark')
  , execFile = require('child_process').execFile
  , img = __dirname + '/../test/fixtures/src/corgi-src-large.jpg'
  , src = fs.readFileSync(img);

var imNativeArgs = ['filter', 'Lagrange', 'scale', '100x100', 'gravity', 'NorthGravity', 'extent', '100x100', 'format', 'webp'];
var imSpawnArgs = ['-filter', 'Lagrange', '-scale', '100x100', '-background', 'transparent', '-gravity', 'North', '-extent', '100x100', 'webp:-'];

var suite = new Benchmark.Suite();

suite.add('native convert, 4MB image', function (deferred) {
  im.convert(
    src,
    imNativeArgs,
    function (err) {
      if (err) {
        return deferred.reject(err);
      }
      deferred.resolve();
    }
  );
}, {
  defer: true
});

suite.add('spawn convert 4MB image', function (deferred) {
  execFile('convert', [img].concat(imSpawnArgs), {
    timeout: 2000
  }, function (err) {
    if (err) {
      return deferred.reject(err);
    }
    deferred.resolve();
  });
}, {
  defer: true
});


suite
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite.run({ async: true });
