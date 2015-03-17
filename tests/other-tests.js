'use strict';

// our modules

var assert = require('../assertive-chai').assert;

// this module

// https://github.com/chaijs/chai/blob/master/test/assert.js
describe('assert', function () {
  // https://github.com/chaijs/chai/blob/master/test/bootstrap/index.js
  var err = function (fn, msg) {
    try {
      fn();
      throw new Error('did not throw an error');
    } catch (error) {
      assert.notEqual('did not throw an error', msg);
    }
  };

  it('deepEqual for issue #4', function() {
    // https://github.com/jokeyrhyme/assertive-chai.js/issues/4
    err(function () {
      assert.deepEqual(1, 3);
    }, "expected 1 and 3 to be deeply equal");
  });

  it('notDeepEqual for issue #4', function() {
    // https://github.com/jokeyrhyme/assertive-chai.js/issues/4
    assert.notDeepEqual(1, 3);
  });

});
