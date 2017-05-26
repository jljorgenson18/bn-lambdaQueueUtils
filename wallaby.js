module.exports = function(wallaby) {

  return {
    files: [{
      pattern: 'index.js',
      instrument: true
    }, {
      pattern: 'src/**/*',
      instrument: true
    }],

    tests: [
      'test/**/*.js'
    ],

    testFramework: 'mocha',

    env: {
      type: 'node'
    },

    workers: {
      recycle: true,
      initial: 4,
      regular: 2
    }
  };
};
