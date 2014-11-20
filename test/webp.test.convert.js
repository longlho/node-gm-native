'use strict';
var gm = require('../index')
  , utils = require('./utils')
  , fs = require('fs');

function convert (src, dest, args, done) {
  var outFilename = __dirname + '/out/' + dest
    , srcFile = __dirname + '/fixtures/src/' + src
    , inputBuffer = fs.readFileSync(srcFile)
    ;

  args || (args = []);

  gm.convert(inputBuffer, args, function (err, outBuffer) {
    if (err) {
      console.log(err);
      return done(err);
    }
    fs.writeFileSync(outFilename, outBuffer);
    utils.compare(outFilename, __dirname + '/fixtures/' + dest, done);
  });
}

describe('convert', function () {

  describe('url', function () {

    // it('should be able to resize to 100x100 w/ aspect fill & format WEBP', function (done) {
    //   var outFilename = __dirname + '/out/convert-url-fill-100.webp'
    //     , outBuffer = gm.convert({
    //       src: "http://127.0.0.1:8000/test/fixtures/corgi-src.jpg",
    //       ops: 'fill',
    //       format: 'WEBP',
    //       width: 100,
    //       height: 100
    //     });
    //   fs.writeFileSync(outFilename, outBuffer);

    //   done();
    // });

  });


  describe('buffer', function () {
    describe('fill', function () {
      describe('format WEBP', function () {
        it('should be able to resize to 100x100 w/ aspect fill', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-fill-100.webp', ['format', 'WEBP', 'resize', '100x100^', 'extent', '100x100', 'Center'], done);
        });

        it('should be able to resize to 100x100 w/ aspect fill w/ transparency', function (done) {
          convert('google.png', 'convert-buffer-fill-transparent-100.webp', ['format', 'WEBP', 'resize', '100x100^', 'extent', '100x100', 'Center'], done);
        });
      });
    });

    describe('resize', function () {
      describe('format WEBP', function () {
        it('should be able to resize to 100x100 w/ aspect fill', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-resize-100.webp', ['format', 'WEBP', 'resize', '100x100'], done);
        });

        it('should be able to resize to 100x100 w/ aspect fill w/ transparency', function (done) {
          convert('google.png', 'convert-buffer-resize-transparent-100.webp', ['format', 'PNG', 'resize', '100x100'], done);
        });
      });
    });
  });
});
