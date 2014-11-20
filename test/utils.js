var execFile = require("child_process").execFile
  , COMPARE_REGEX = /\((.*?)\)/m
  , SIZE_REGEX = / (\d+x\d+) /m;

module.exports = {
  compare: function (src, dest, cb) {
    execFile('compare', ['-metric', 'mse', src, dest, 'null:'], function (err) {
      if (!err) return cb();
      var diff = parseFloat(COMPARE_REGEX.exec(err.message)[1]);
      // 0.001 is good enuf since images created in a diff OS will not be exactly the same as the fixtures
      if (diff > 0.001) {
        throw new Error(src + ' & ' + dest + ' have difference of ' + diff);
      }
      cb();
    });
  }
}