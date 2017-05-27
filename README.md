# lambdaQueueUtils
This is a set of utils for


## Installation:
```sh
npm install @buyerneeds/lambda-utils --save
```

## Usage:
To use in your Lambda function, you can pass in

```js

const {getKinesisHandler} = require('@buyerneeds/lambda-utils');

const eventHandlers = {
  someType: (record) => {
    console.log('Handling the record!');
  }
};


exports.handler = getQueueHandler(eventHandlers);


```
