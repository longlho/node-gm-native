'use strict';
var gm = require('../index')
  , utils = require('./utils')
  , fs = require('fs');

function convert (src, dest, args, done, expectErr) {
  var outFilename = __dirname + '/out/' + dest
    , srcFile = __dirname + '/fixtures/src/' + src
    ;

  args || (args = []);

  fs
    .createReadStream(srcFile)
    .pipe(gm.streams.convert({
      args: args
    }))
    .on('error', function () {
      if (expectErr) {
        return done();
      }
    })
    .pipe(fs.createWriteStream(outFilename))
    .on('finish', function () {
      utils.compare(outFilename, __dirname + '/fixtures/' + dest, done);
    });
}

describe('streams.convert', function () {

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

      describe('format PNG', function () {

        it('should be able to resize to 100x100 w/ aspect fill format PNG', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-fill-100.png', ['format', 'PNG', 'resize', '100x100^', 'extent', '100x100', 'Center'], done);
        });

        it('should be able to resize to 100x100 w/ aspect fill w/ transparency', function (done) {
          convert('google.png', 'convert-buffer-fill-google-transparent-100.png', ['format', 'PNG', 'resize', '100x100^', 'extent', '100x100', 'Center'], done);
        });
      });

      it('should be able to resize to 100x100 w/ aspect fill w/o format', function (done) {
        convert('corgi-src.jpg', 'convert-buffer-fill-100.jpg', ['resize', '100x100^', 'extent', '100x100', 'Center'], done);
      });

      it('should emit error if buffer is invalid', function (done) {
        convert('bad.jpg', 'convert-buffer-fill-100.jpg', ['resize', '100x100^', 'extent', '100x100', 'Center'], done, true);
      });

    });

    describe('resize', function () {

      describe('format PNG', function () {

        it('should be able to resize to 100x100 w/ aspect fill format PNG', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-resize-100.png', ['resize', '100x100', 'format', 'PNG'], done);
        });

        it('should be able to resize to 100x100 w/ aspect fill w/ transparency', function (done) {
          convert('google.png', 'convert-buffer-resize-google-transparent-100.png', ['resize', '100x100', 'format', 'PNG'], done);
        });
      });

      describe('w/o format', function () {
        it('should be able to resize to 100x100 w/ aspect fill w/o format', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-resize-100.jpg', ['resize', '100x100'], done);
        });
      });
    });

    describe('blur', function () {
      describe('format jpg', function () {
        it('should be able to blur by 20 w/ format jpg', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-blur.jpg', ['blurSigma', 20, 'resize', '100x100^', 'extent', '100x100', 'Center', 'format', 'JPG'], done);
        });
      });
    });
  });
});
