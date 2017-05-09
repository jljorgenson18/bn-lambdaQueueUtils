const Promise = require('bluebird');
const get = require('lodash/get');
const AWS = require('aws-sdk');

const extractEventData = (data) => {
  let payload = null;
  try {
    payload = Buffer.from(data, 'base64').toString();
    payload = JSON.parse(payload);
  } catch (err) {}
  return payload;
};

exports.handleEventRecords = (params) => {
  const {records = [], handleEvent, whiteList, deadLetter, typeKey = 'type'} = params;
  let deadLetterKinesis;
  if(!handleEvent) {
    throw new Error('handleEvent is required');
  }
  if(deadLetter && deadLetter.config) {
    deadLetterKinesis = new AWS.Kinesis(deadLetter.config);
  }
  const kinesisRecords = records.filter(rec => get(rec, 'kinesis.data', false));
  return Promise.map(kinesisRecords, record => {
    const eventData = extractEventData(record.kinesis.data);
    const eventType = get(eventData, typeKey, null);
    if(whiteList && (!eventType || !whiteList[eventType])) {
      return;
    }
    return handleEvent(eventData, record.kinesis.approximateArrivalTimestamp).catch(err => {
      return Promise.resolve({
        failed: true,
        eventData,
        eventTimeStamp: record.kinesis.approximateArrivalTimestamp,
        partitionKey: record.kinesis.partitionKey,
        err
      });
    });
  }).then(results => {
    const failedResults = results.filter(result => result.failed);
    if(deadLetterKinesis && deadLetter.StreamName) {
      const deadLetterRecords = failedResults.map(result => {
        const {eventData, eventTimeStamp, partitionKey, err} = result;
        return {
          Data: JSON.stringify({
            eventData,
            eventTimeStamp,
            errMessage: err.message,
            errStack: err.stack
          }),
          PartitionKey: partitionKey
        };
      });
      return deadLetterKinesis.putRecords({
        StreamName: deadLetter.StreamName,
        Records: deadLetterRecords
      }).promise();
    }
  });
};
