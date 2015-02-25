'use strict';
var gm = require(__dirname + '/build/Release/gm-native');
var util = require('util');
var Transform = require('stream').Transform;

util.inherits(ConvertStream, Transform);

function ConvertStream (opts) {
  opts || (opts = {});
  if (!(this instanceof ConvertStream)) {
    return new ConvertStream(opts);
  }

  Transform.call(this, opts);
  this._buffer = [];
  this._args = opts.args;
}

ConvertStream.prototype._transform = function (chunk, encoding, cb) {
  this._buffer.push(chunk);
  cb();
};

ConvertStream.prototype._flush = function (cb) {
  var self = this;
  exports.convert(Buffer.concat(this._buffer), this._args, function (err, buffer) {
    if (err) {
      return cb(err);
    }
    self.push(buffer);
    cb();
  });
};

exports.convert = gm.convert;
exports.streams = {
  convert: ConvertStream
};
