var _ = require('underscore')._
  , im = require('../index')
  , utils = require('./utils')
  , fs = require('fs');

function convert (src, dest, opts, done) {
  var outFilename = __dirname + '/out/' + dest
    , outBuffer = im.convert(_.extend({
      src: fs.readFileSync(__dirname + '/fixtures/src/' + src),
      ops: 'fill',
      width: 100,
      height: 100
    }, opts));
  fs.writeFileSync(outFilename, outBuffer);
  utils.compare(outFilename, __dirname + '/fixtures/' + dest, done);
}

describe('convert', function () {

  describe('url', function () {
    
    // it('should be able to resize to 100x100 w/ aspect fill & format WEBP', function (done) {
    //   var outFilename = __dirname + '/out/convert-url-fill-100.webp'
    //     , outBuffer = im.convert({
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
          convert('corgi-src.jpg', 'convert-buffer-fill-100.webp', {
            format: 'WEBP'
          }, done);
        });

        it('should be able to resize to 100x100 w/ aspect fill w/ transparency', function (done) {
          convert('google.png', 'convert-buffer-fill-transparent-100.webp', {
            format: 'WEBP'
          }, done);
        });
      });

      describe('format PNG', function () {

        it('should be able to resize to 100x100 w/ aspect fill format PNG', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-fill-100.png', {
            format: 'PNG',
          }, done);
        });

        it('should be able to resize to 100x100 w/ aspect fill w/ transparency', function (done) {
          convert('google.png', 'convert-buffer-fill-google-transparent-100.png', {
            format: 'PNG',
          }, done);
        });
      });

      describe('w/o format', function () {
        it('should be able to resize to 100x100 w/ aspect fill w/o format', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-fill-100.jpg', null, done);
        });
      });
    });
    
    describe('resize', function () {
      describe('format WEBP', function () {
        it('should be able to resize to 100x100 w/ aspect fill', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-resize-100.webp', {
            ops: 'resize',
            format: 'WEBP'
          }, done);
        });

        it('should be able to resize to 100x100 w/ aspect fill w/ transparency', function (done) {
          convert('google.png', 'convert-buffer-resize-transparent-100.webp', {
            ops: 'resize',
            format: 'WEBP'
          }, done);
        });
      });

      describe('format PNG', function () {

        it('should be able to resize to 100x100 w/ aspect fill format PNG', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-resize-100.png', {
            ops: 'resize',
            format: 'PNG',
          }, done);
        });

        it('should be able to resize to 100x100 w/ aspect fill w/ transparency', function (done) {
          convert('google.png', 'convert-buffer-resize-google-transparent-100.png', {
            ops: 'resize',
            format: 'PNG',
          }, done);
        });
      });

      describe('w/o format', function () {
        it('should be able to resize to 100x100 w/ aspect fill w/o format', function (done) {
          convert('corgi-src.jpg', 'convert-buffer-resize-100.jpg', {
            ops: 'resize'
          }, done);
        });
      });
    });
  });
});