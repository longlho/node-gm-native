var chai = require('chai')
  , chaiAsPromised = require('chai-as-promised')
  , im = require('../index')
  , fs = require('fs');
chai.should();
chai.use(chaiAsPromised);


describe('convert', function () {

  it('should convert URL', function () {
    fs.writeFileSync(__dirname + '/out/test.webp', im.convert({
      src: "http://assets.iheart.com/images/1080/MI0003492776.jpg",
      ops: 'fill',
      format: 'WEBP',
      width: 100,
      height: 100
    }));
  });
  it('should convert buffer', function () {
    fs.writeFileSync(__dirname + '/out/test2.jpg', im.convert({
      src: fs.readFileSync(__dirname + '/fixtures/34741.jpg'),
      width: 100,
      height: 100,
      ops: 'fill'
    }));
  });
});