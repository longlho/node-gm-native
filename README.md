gm-native
=========

[![Build Status](https://travis-ci.org/longlho/node-gm-native.svg?branch=master)](https://travis-ci.org/longlho/node-gm-native)


Native GraphicsMagick++ addon for Node. **Still in development**

Quick usage:

```javascript

var gm = require('gm-native');

var outputBuffer = gm.convert({
  // Required. Can also be URL, file path or Buffer object. Note that IM is IO-blocking so using path/URL will block the process
  src: 'test.jpg',
  // Required. Operations, right now only has fit & fill (aspect ratio is maintained)
  ops: 'fit',
  // Gravity for when using fill, see http://www.graphicsmagick.org/api/types.html#gravitytype
  gravity: 'NorthGravity',
  // Output format. See http://www.graphicsmagick.org/Magick++/Image.html#format. When using webp make sure you compile ImageMagick w/ libwebp
  format: 'WEBP',
  // Width, required if height is specified
  width: 100,
  // Height, required if width is specified
  height: 100,
  // Quality, 0 - 100, default is 75
  quality: 75,
  // Blue sigma
  blurSigma: 0
});
```

TODO
---

- Figure out optional width & height
- More tests
- Composite (for rounded corners...)
