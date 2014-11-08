'use strict';

var gm = require('../index')
  , http = require('http')
  , request = require('request')
  , execFile = require('child_process').execFile;

// console.time('Spawn 100 IM processes');
// var done = 100;
// for (var i = 0; i < 100; i++) {
//   execFile("convert", ["http://radioedit.iheart.com/service/img/nop()/assets/images/1469.png", "-resize", "100x100^", '-background', 'transparent', '-gravity', 'North', '-extent', '100x100', "webp:-"], {
//     timeout: 2000
//   }, function (err, stdout, stderr) {
//     if (err || !stdout || !stdout.length) {
//       console.log('err spawning convert');
//       console.log(err);
//       process.exit(1);
//     }
//     done--;
//     if (!done) {
//       console.timeEnd('Spawn 100 IM processes');
//       testAsyncReq();
//     }
//   })
// }



console.time('Async img req + native convert 100 times');
var done = 100;
for (var i = 0; i < 100; i++) {
  request({
    url: "http://radioedit.iheart.com/service/img/nop()/assets/images/1469.png",
    timeout: 10000,
    encoding: null
  }, function (err, resp, data) {
    gm.convert({
      src: data,
      width: 100,
      height: 100,
      ops: 'fill',
      format: 'WEBP'
    });
    done--;
    if (!done) {
      console.timeEnd('Async img req + native convert 100 times');
      testRawIM();
    }
  });
}


function testRawIM() {
  request({
    url: "http://radioedit.iheart.com/service/img/nop()/assets/images/1469.png",
    timeout: 10000,
    encoding: null
  }, function (err, resp, data) {
    console.time('Raw IM power');
    for (var i = 0; i < 100; i++) {
      gm.convert({
        src: data,
        width: 100,
        height: 100,
        ops: 'fill',
        format: 'WEBP'
      });
    }

    console.timeEnd('Raw IM power');
    testAsyncReqExec();
  });

}

function testAsyncReqExec() {
  console.time('Async img req + spawn convert 100 times');
  var done = 100;
  for (var i = 0; i < 100; i++) {
    execFile("gm", ["convert", "http://radioedit.iheart.com/service/img/nop()/assets/images/1469.png", "-resize", "100x100^", '-background', 'transparent', '-gravity', 'North', '-extent', '100x100', "webp:-"], {
      timeout: 1000
    }, function (err, stdout, stderr) {
      done--;
      if (!done) {
        console.timeEnd('Async img req + spawn convert 100 times');
      }
    });
  }
}
