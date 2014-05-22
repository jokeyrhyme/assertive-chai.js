/*jslint indent:2. node:true*/
/*global define, require*/ // AMD + Require.JS

// UMD pattern: https://github.com/umdjs/umd/blob/master/returnExportsGlobal.js
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['assert'], function (assert) {
      return (root.chai = factory(assert));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('assert'));
  } else {
    root.chai = factory(root.assert);
  }
}(this, function (assert) {
  'use strict';

  var chai;

  chai = {};

  chai.assert = function () {
    return assert.apply(this, arguments);
  };

  chai.assert.deepEqual = assert.deepEqual;
  chai.assert.equal = assert.equal;
  chai.assert.fail = assert.fail;
  chai.assert.strictEqual = assert.strictEqual;
  chai.assert.throws = assert.throws;

  chai.assert.notDeepEqual = assert.notDeepEqual;
  chai.assert.notEqual = assert.notEqual;
  chai.assert.notFail = assert.notFail;
  chai.assert.notStrictEqual = assert.notStrictEqual;
  chai.assert.doesNotThrow = assert.doesNotThrow;

  chai.assert.ifError = assert.ifError;

  return chai;
}));
