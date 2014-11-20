im-native
=========

[![Build Status](https://travis-ci.org/longlho/im-native.svg?branch=master)](https://travis-ci.org/longlho/im-native)


Native binding for Magick++. **Still in development**

Quick usage:

```javascript

var im = require('im-native');

var outputBuffer = im.convert(
  // Required. Can also be URL, file path or Buffer object. Note that IM is IO-blocking so using path/URL will block the process
  'test.jpg',
  // Required. Operations, just like arguments you'd pass to `convert` process
  ['scale', '100x100^', 'quality', 75, 'format', 'WEBP', 'extent', '100x100', 'CenterGravity', 'blurSigma', 5],
  // Required, callback function
  callbackFn
});
```

Supported methods
---

**NOTE**: Orders do matter

- `['strip']`
- `['interlace', '<interlaceType>']`
- `['scale', '<width>x<height><flag>']`
- `['extent', '<width>x<height', '<gravity>']`
- `['format', '<JPG/PNG/WEBP>']`
- `['quality', '<0 - 100>']`
- `['filter', '<filter types>']`
- `['blurSigma', '<blurSigma>']`

TODO
---

- Figure out optional width & height
- More tests
- Composite (for rounded corners...)
