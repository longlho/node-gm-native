gm-native
=========

[![Build Status](https://travis-ci.org/longlho/node-gm-native.svg?branch=master)](https://travis-ci.org/longlho/node-gm-native)


Native binding for GraphicsMagick++. Some details can be found in this [blog post](https://medium.com/@longho/getting-cozy-with-node-native-add-ons-be045e2f2386).

Quick usage:

```javascript

var gm = require('gm-native');

var outputBuffer = gm.convert(
  // Required. Can also be URL, file path or Buffer object. Note that GM is IO-blocking so using path/URL will block the process
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
