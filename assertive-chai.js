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

  var chai, natives, typeOf;

  chai = {};

  // import Node.JS's assertions

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

  // https://github.com/chaijs/chai/blob/master/lib/chai/utils/type.js

  natives = {
    '[object Arguments]': 'arguments',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object Function]': 'function',
    '[object Number]': 'number',
    '[object RegExp]': 'regexp',
    '[object String]': 'string'
  };

  typeOf = function (obj) {
    var str = Object.prototype.toString.call(obj);
    if (natives[str]) return natives[str];
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (obj === Object(obj)) return 'object';
    return typeof obj;
  };

  // implement Chai.JS's assertions

  chai.assert.isTrue = function (value, msg) {
    return chai.assert.equal(value, true, msg);
  };

  chai.assert.ok = function (value, msg) {
    return chai.assert(!!value, true, msg);
  };

  chai.assert.notOk = function (value, msg) {
    return chai.assert(!value, true, msg);
  };

  chai.assert.isFalse = function (value, msg) {
    return chai.assert.equal(value, false, msg);
  };

  chai.assert.typeOf = function (value, type, msg) {
    return chai.assert.equal(typeOf(value), type, msg);
  };

  chai.assert.notTypeOf = function (value, type, msg) {
    return chai.assert.notEqual(typeOf(value), type, msg);
  };

  chai.assert.instanceOf = function (value, constructor, msg) {
    return chai.assert.isTrue(value instanceof constructor, msg);
  };

  chai.assert.notInstanceOf = function (value, constructor, msg) {
    return chai.assert.isFalse(value instanceof constructor, msg);
  };

  chai.assert.isObject = function (value, msg) {
    return chai.assert.typeOf(value, 'object', msg);
  };

  chai.assert.isNotObject = function (value, msg) {
    return chai.assert.notTypeOf(value, 'object', msg);
  };

  chai.assert.isNull = function (value, msg) {
    return chai.assert.typeOf(value, 'null', msg);
  };

  chai.assert.isNotNull = function (value, msg) {
    return chai.assert.notTypeOf(value, 'null', msg);
  };

  chai.assert.isUndefined = function (value, msg) {
    return chai.assert.typeOf(value, 'undefined', msg);
  };

  chai.assert.isDefined = function (value, msg) {
    return chai.assert.notTypeOf(value, 'undefined', msg);
  };

  chai.assert.isFunction = function (value, msg) {
    return chai.assert.typeOf(value, 'function', msg);
  };

  chai.assert.isNotFunction = function (value, msg) {
    return chai.assert.notTypeOf(value, 'function', msg);
  };

  chai.assert.isArray = function (value, msg) {
    if (Array.isArray) {
      return chai.assert.isTrue(Array.isArray(value), msg);
    }
    return chai.assert.typeOf(value, 'array', msg);
  };

  chai.assert.isNotArray = function (value, msg) {
    if (Array.isArray) {
      return chai.assert.isFalse(Array.isArray(value), msg);
    }
    return chai.assert.notTypeOf(value, 'array', msg);
  };

  chai.assert.isString = function (value, msg) {
    return chai.assert.typeOf(value, 'string', msg);
  };

  chai.assert.isNotString = function (value, msg) {
    return chai.assert.notTypeOf(value, 'string', msg);
  };

  chai.assert.isNumber = function (value, msg) {
    return chai.assert.typeOf(value, 'number', msg);
  };

  chai.assert.isNotNumber = function (value, msg) {
    return chai.assert.notTypeOf(value, 'number', msg);
  };

  chai.assert.isBoolean = function (value, msg) {
    return chai.assert.typeOf(value, 'boolean', msg);
  };

  chai.assert.isNotBoolean = function (value, msg) {
    return chai.assert.notTypeOf(value, 'boolean', msg);
  };

  return chai;
}));
