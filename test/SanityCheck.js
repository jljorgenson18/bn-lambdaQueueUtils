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

  it('should be here', () => {
    // Arrange

    // Act

    // Assert
    expect(utils).to.be.ok;

  });

  it('should be exporting all of the correct keys', () => {
    // Arrange

    // Act

    // Assert
    expect(utils).to.have.all.keys(['KinesisHandler']);
  });

});
