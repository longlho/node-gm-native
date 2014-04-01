var fs = require('fs')
  , im = require('../index')
  , execFile = require('child_process').execFile
  , img = __dirname + '/fixtures/1469.png'
  , src = fs.readFileSync(img);

console.time('Native convert 100 times');
for (var i = 0; i < 100; i++) {
  im.convert({
    src: src
  });
}
console.timeEnd('Native convert 100 times');

console.time('spawn convert 100 times');
var done = 100;
for (i = 0; i < 100; i++) {
  execFile('convert', [img, '-resize', '100x100', '-background', 'transparent', '-gravity', 'North', '-extent', '100x100', 'webp:-'], {
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
