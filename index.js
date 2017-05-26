const Promise = require('bluebird');
const get = require('lodash/get');

const extractEventData = (data) => {
  let payload = null;
  try {
    payload = Buffer.from(data, 'base64').toString();
    payload = JSON.parse(payload);
  } catch (err) {}
  return payload;
};

const isKinesisEvent = (event) => {
  return Boolean(event, 'Records[0].kinesis');
};

const getRecordsFromKinesisEvent = (event) => {
  return event.Records.map(rec => extractEventData(rec.kinesis.data));
};

const extractRecordsFromEvent = (event, typeKey) => {
  // Handle kinesis events
  if(isKinesisEvent(event)) {
    return getRecordsFromKinesisEvent(event);
  } else {
    // Handle manual events
    return Array.isArray(event) ? event : [event];
  }
};

exports.getQueueHandler = (eventHandlers, params) => {
  if(!eventHandlers) {
    throw new Error('No event handlers!');
  }
  params = params || {};
  const {typeKey = 'type'} = params;
  return (event, context) => {
    return Promise.resolve().then(() => {
      let records = extractRecordsFromEvent(event);
      // Filtering out records that are not properly formatted
      records = records.filter(rec => rec && rec[typeKey]);
      // And now handling the records
      return Promise.map(records, record => {
        const type = rec[typeKey];
        if(eventHandlers[type]) {
          console.log('Handling ' + type);
          return eventHandlers[type](record);
        }
      });
    }).then(responses => {
      context.succeed(responses);
    }).catch(errs => {
      context.fail(errs);
    });
  };
};
