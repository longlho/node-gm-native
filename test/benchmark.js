var im = require('../index')
  , http = require('http')
  , execFile = require('child_process').execFile;

console.time('Native IM 100 times');
for (var i = 0; i < 100; i++) {
  im.convert({
    src: "http://radioedit.iheart.com/service/img/nop()/assets/images/1469.png"
  });
}
console.timeEnd('Native IM 100 times');

console.time('Spawn 100 IM processes');
var done = 100;
for (i = 0; i < 100; i++) {
  execFile("convert", ["http://radioedit.iheart.com/service/img/nop()/assets/images/1469.png", "-resize", "100x100", '-background', 'transparent', '-gravity', 'North', '-extent', '100x100', "webp:-"], {
    timeout: 2000
  }, function (err, stdout, stderr) {
    if (err || !stdout || !stdout.length) {
      console.log('err spawning convert');
      console.log(err);
      process.exit(1);
    }
    done--;
    if (!done) {
      console.timeEnd('Spawn 100 IM processes');
      testAsyncReq();
    }
  })
}


function testAsyncReq() {
  console.time('Async img req + native convert 100 times');
  var done = 100;
  for (var i = 0; i < 100; i++) {
    http.get("http://radioedit.iheart.com/service/img/nop()/assets/images/1469.png", function (resp) {
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
          console.timeEnd('Async img req + native convert 100 times');
          testAsyncReqExec();
        }
      })
    })
  }
}

function testAsyncReqExec() {
  console.time('Async img req + spawn convert 100 times');
  var done = 100;
  for (var i = 0; i < 100; i++) {
    http.get("http://radioedit.iheart.com/service/img/nop()/assets/images/1469.png", function (resp) {
      var ps = execFile("convert", ["-", "-resize", "100x100", '-background', 'transparent', '-gravity', 'North', '-extent', '100x100', "webp:-"], {
        timeout: 1000
      }, function (err, stdout, stderr) {
        done--;
        if (!done) {
          console.timeEnd('Async img req + spawn convert 100 times');
        }
      });
      resp.pipe(ps.stdin);
    })
  }
}
