var im = require('../index')
  , http = require('http')
  , execFile = require('child_process').execFile;

console.time('Native IM 200 times');
for (var i = 0; i < 200; i++) {
  im.convert({
    src: "http://assets.iheart.com/images/override/34741.jpg"
  });
}
console.timeEnd('Native IM 200 times');

console.time('Spawn 200 IM processes');
var done = 200;
for (i = 0; i < 200; i++) {
  execFile("convert", ["http://assets.iheart.com/images/override/34741.jpg", "-resize", "200x200", "webp:-"], {
    timeout: 2000
  }, function (err, stdout, stderr) {
    done--;
    if (!done) {
      console.timeEnd('Spawn 200 IM processes');
      testAsyncReq();
    }
  })
}


function testAsyncReq() {
  console.time('Async img convert 200 times');
  var done = 200;
  for (var i = 0; i < 200; i++) {
    http.get("http://assets.iheart.com/images/override/34741.jpg", function (resp) {
      var data = [];
      resp
      .on('data', function (d) {
        data.push(d);
      })
      .on('end', function () {
        data = Buffer.concat(data);
        im.convert({
          src: data
        });
        done--;
        if (!done) {
          console.timeEnd('Async img convert 200 times');
        }
      })
    })
  }
}
