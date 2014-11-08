'use strict';

var fs = require('fs')
  , gm = require('../index')
  , execFile = require('child_process').execFile
  , img = __dirname + '/../test/fixtures/src/corgi-src.jpg'
  , src = fs.readFileSync(img);

console.time('Native convert 100 times');
for (var i = 0; i < 100; i++) {
  gm.convert({
    src: src
  });
}
console.timeEnd('Native convert 100 times');

console.time('spawn convert 100 times');
var done = 100;
var args = ['convert', img, '-resize', '100x100', '-background', 'transparent', '-gravity', 'North', '-extent', '100x100', 'webp:-'];
console.log(args.join(' '));
for (i = 0; i < 100; i++) {
  execFile('gm', args, {
    timeout: 2000
  }, function (err) {
    if (err) {
      return console.log(err);
    }
    done--;
    if (!done) {
      console.timeEnd('spawn convert 100 times');
    }
  });
}
