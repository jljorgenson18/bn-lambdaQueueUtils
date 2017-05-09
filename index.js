
exports.handleEventRecords = (records = [], handleEvent, whiteList) => {
  const kinesisRecords = records.filter(rec => rec.kinesis && rec.kinesis.data);
  const handlePromises = kinesisRecords.map(rec => {
    const eventData = extractEventData(rec.kinesis.data);
    if(eventData && eventData.type && (!whiteList || whiteList[eventData.type])) {
      return handleEvent(eventData, rec.kinesis.approximateArrivalTimestamp);
    }
    return Promise.resolve();
  });
};
