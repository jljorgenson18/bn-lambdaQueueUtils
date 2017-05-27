const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');

const {expect} = chai;

const utils = require('../index');

chai.use(chaiAsPromised);

describe('SanityCheck', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
    sandbox = null;
  });

  it('should be here with all of the correct keys', () => {
    // Arrange

    // Act

    // Assert
    console.log(Object.keys(utils));
    expect(utils).to.be.ok;

  });

});
