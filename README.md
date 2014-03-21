im-native
=========

[![Build Status](https://travis-ci.org/longlho/im-native.svg?branch=master)](https://travis-ci.org/longlho/im-native)


Node ImageMagick Native module, essentially a rewrite of [node-imagemagick-native](https://github.com/mash/node-imagemagick-native). **Still in development**

Quick usage:

```javascript

var im = require('im-native');

var outputBuffer = im.convert({
  // Required. Can also be URL, file path or Buffer object. Note that IM is IO-blocking so using path/URL will block the process
  src: 'test.jpg',
  // Required. Operations, right now only has fit & fill (aspect ratio is maintained)
  ops: 'fit',
  // Gravity for when using fill, see http://www.imagemagick.org/Magick++/Enumerations.html#GravityType
  gravity: 'NorthGravity',
  // Output format. See http://www.imagemagick.org/script/formats.php. When using webp make sure you compile ImageMagick w/ libwebp
  format: 'WEBP',
  // Width, required if height is specified
  width: 100,
  // Height, required if width is specified
  height: 100,
  // Quality, 0 - 100, default is 75
  quality: 75
});
```

TODO
---

Figure out optional width & height