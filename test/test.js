var chai = require('chai')
  , chaiAsPromised = require('chai-as-promised')
  , im = require('../index')
  , fs = require('fs');
chai.should();
chai.use(chaiAsPromised);


describe('Test', function () {
  it('should convert URL', function () {
    fs.writeFileSync('test.webp', im.convert({ src: "http://assets.iheart.com/images/override/34741.jpg" }));
  });
  it('should convert buffer', function () {
    fs.writeFileSync('test2.webp', im.convert({ src: fs.readFileSync(__dirname + '/fixtures/34741.jpg') }));
  });
});