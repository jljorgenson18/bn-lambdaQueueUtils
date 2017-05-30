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
  return Boolean(get(event, 'Records[0].kinesis'));
};

const getRecordsFromKinesisEvent = (event) => {
  return event.Records.map(rec => extractEventData(rec.kinesis.data));
};

const extractRecordsFromEvent = (event, typeKey) => {
  // Handle kinesis events
  if(isKinesisEvent(event)) {
    return getRecordsFromKinesisEvent(event);
  }
  return [];
};

exports.getHandler = (eventHandlers, params) => {
  if(!eventHandlers) {
    throw new Error('No event handlers!');
  }
  params = params || {};
  const {typeKey = 'type'} = params;
  return (event, context, callback) => {
    return Promise.resolve().then(() => {
      // Setting the NODE_ENV to production if it was a prod alias
      if(context.invokedFunctionArn.toLowerCase().indexOf(':prod') !== -1) {
        process.env.NODE_ENV = 'production';
      }
      let records = extractRecordsFromEvent(event);
      // Filtering out records that are not properly formatted
      records = records.filter(rec => rec && rec[typeKey]);
      // And now handling the records
      return Promise.mapSeries(records, record => {
        const type = record[typeKey];
        if(eventHandlers[type]) {
          return eventHandlers[type](record);
        }
      });
    }).then(responses => {
      callback(null, responses);
    }).catch(errs => {
      callback(errs, null);
    });
  };
};
