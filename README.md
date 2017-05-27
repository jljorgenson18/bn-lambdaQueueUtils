# lambdaQueueUtils
This is a set of utils to help handle events in lambda functions


## Installation:
```sh
npm install @buyerneeds/lambda-utils --save
```

## Usage:


#### Kinesis

```js

const {KinesisHandler} = require('@buyerneeds/lambda-utils');

const eventHandlers = {
  someType: (record) => {
    console.log('Handling the record!');
  }
};


exports.handler = KinesisHandler.getHandler(eventHandlers);


```


ChangeLog:

* 0.0.1 - First working version
