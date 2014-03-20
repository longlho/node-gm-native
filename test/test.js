var chai = require('chai')
  , chaiAsPromised = require('chai-as-promised')
  , im = require('../index')
  , fs = require('fs');
chai.should();
chai.use(chaiAsPromised);


describe('Test', function () {
  it('should add', function () {
    fs.writeFileSync('test.webp', im.convert({ src: "http://assets.iheart.com/images/override/34741.jpg" }));
  });
});