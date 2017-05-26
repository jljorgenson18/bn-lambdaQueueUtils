const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');

const handler = require('../index');

const {expect} = chai;

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
    expect(handler).to.be.ok;

  });

});
