const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');

const utils = require('../index');
const {expect} = chai;

const getSampleKinesisEvent = (eventData) => {
  return {
    'Records': [
      {
        'eventID': 'shardId-000000000000:49545115243490985018280067714973144582180062593244200961',
        'eventVersion': '1.0',
        'kinesis': {
          'approximateArrivalTimestamp': 1428537600,
          'partitionKey': 'partitionKey-3',
          'data': Buffer.from(JSON.stringify(eventData)).toString('base64'),
          'kinesisSchemaVersion': '1.0',
          'sequenceNumber': '49545115243490985018280067714973144582180062593244200961'
        },
        'invokeIdentityArn': 'arn:aws:iam::EXAMPLE',
        'eventName': 'aws:kinesis:record',
        'eventSourceARN': 'arn:aws:kinesis:EXAMPLE',
        'eventSource': 'aws:kinesis',
        'awsRegion': 'us-east-1'
      }
    ]
  };
};

chai.use(chaiAsPromised);

describe('Index', () => {
  let sandbox;
  let mockEventHandlers;
  let mockParams;
  let mockEvent;
  let mockCallback;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    mockEventHandlers = {
      someType: sandbox.stub().resolves()
    };
    mockParams = null;
    mockEvent = {
      type: 'someType',
      payload: {}
    };
    mockCallback = sandbox.spy();
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

  it('should return a function if event handlers are passed in', () => {
    // Arrange

    // Act
    const handler = utils.getQueueHandler(mockEventHandlers);

    // Assert
    expect(handler).to.be.a('function');
  });

  it('should call the callback if valid params', () => {
    // Arrange
    const handler = utils.getQueueHandler(mockEventHandlers);

    // Act
    const resultPromise = handler(mockEvent, null, mockCallback);

    // Assert
    return resultPromise.then(responses => {
      expect(mockCallback.args[0][0]).to.be.null;
    });
  });

  describe('Kinesis Events', () => {

    beforeEach(() => {
      mockEvent = getSampleKinesisEvent(mockEvent);
    });

    it('should handle a kinesis event', () => {
      // Arrange
      const handler = utils.getQueueHandler(mockEventHandlers);

      // Act
      const resultPromise = handler(mockEvent, null, mockCallback);

      // Assert
      return resultPromise.then(responses => {
        expect(mockCallback.args[0][0]).to.be.null;
      });
    });

    it('should call the proper event handler', () => {
      // Arrange
      const handler = utils.getQueueHandler(mockEventHandlers);

      // Act
      const resultPromise = handler(mockEvent, null, mockCallback);

      // Assert
      return resultPromise.then(responses => {
        expect(mockEventHandlers.someType.args[0][0]).to.deep.equal({
          type: 'someType',
          payload: {}
        });
      });
    });

  });

  describe('Inline event', () => {

    it('should handle an inline event', () => {
      // Arrange
      const handler = utils.getQueueHandler(mockEventHandlers);

      // Act
      const resultPromise = handler(mockEvent, null, mockCallback);

      // Assert
      return resultPromise.then(responses => {
        expect(mockCallback.args[0][0]).to.be.null;
      });

    });

    it('should call the proper event handler', () => {
      // Arrange
      const handler = utils.getQueueHandler(mockEventHandlers);

      // Act
      const resultPromise = handler(mockEvent, null, mockCallback);

      // Assert
      return resultPromise.then(responses => {
        expect(mockEventHandlers.someType.args[0][0]).to.deep.equal({
          type: 'someType',
          payload: {}
        });
      });
    });

  });

  it('should pass an error into the callback if an error was thrown', () => {
    // Arrange
    const sampleError = new Error('O No! The handler screwed up!');
    mockEventHandlers.someType = sandbox.stub().rejects(sampleError);

    // Arrange
    const handler = utils.getQueueHandler(mockEventHandlers);

    // Act
    const resultPromise = handler(mockEvent, null, mockCallback);

    // Assert
    return resultPromise.then(responses => {
      expect(mockCallback.args[0][0]).to.equal(sampleError);
    });

  });


});
