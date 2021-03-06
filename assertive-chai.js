/* eslint-env browser, node */
/* eslint-disable no-param-reassign */ // too lazy to fix this widespread style

'use strict';

// Node.js built-ins

var assert = require('assert');

// 3rd-party modules

var deepEql = require('deep-eql');
var indexOf = require('lodash.indexof');
var pathval = require('pathval');
var typeOf = require('type-detect');

// this module

var chai;

chai = {};

// import Node.JS's assertions

chai.assert = function () {
  return assert.apply(this, arguments);
};

chai.assert.equal = assert.equal;
chai.assert.fail = assert.fail;
chai.assert['throws'] = assert['throws'];

chai.assert.notFail = assert.notFail;
chai.assert.doesNotThrow = assert.doesNotThrow;

// https://github.com/chaijs/chai/blob/master/lib/chai/utils/type.js

// implement Chai.JS's assertions

function formatAsJSON (value) {
  var type = typeOf(value);
  var json;
  if (typeof window !== 'undefined' && window.navigator) {
    // in a browser-like environment
    if (window.navigator.userAgent.indexOf('Phantom') !== -1) {
      // in PhantomJS
      return '[' + type + ']';
    }
  }
  if (type === 'array' || type === 'object') {
    try {
      json = JSON.stringify(value);
      if (json === '[]' || json === '{}') {
        return json;
      }
      json = json.replace(/([{\[,:])/g, '$1 ');
      json = json.replace(/([}\]])/g, ' $1');
      json = json.replace(/"(\w+)":/g, '$1:');
      json = json.replace(/"/g, '\'');
      json = json.replace(/\s*$/g, ''); // ES3-friendly trim
      return json;
    } catch (ignore) {
      return '[' + type + ']';
    }
  }
}

function format (value) {
  var type = typeOf(value);
  switch (type) {
    case 'array':
      return formatAsJSON(value);
    case 'function':
      return value.name ? '[Function: ' + value.name + ']' : '[Function]';
    case 'object':
      return formatAsJSON(value);
    case 'string':
      return '\'' + value + '\'';
    default:
      return value;
  }
}

chai.assert.notEqual = function (actual, expected, msg) {
  msg = msg || 'expected ' + format(actual) + ' to not equal ' + expected;
  assert.notEqual(actual, expected, msg);
};

chai.assert.strictEqual = function (actual, expected, msg) {
  msg = msg || 'expected ' + format(actual) + ' to equal ' + expected;
  assert.strictEqual(actual, expected, msg);
};

chai.assert.notStrictEqual = function (actual, expected, msg) {
  msg = msg || 'expected ' + format(actual) + ' to not equal ' + expected;
  assert.notStrictEqual(actual, expected, msg);
};

chai.assert.deepEqual = function (actual, expected, msg) {
  msg = msg || 'expected ' + format(actual) + ' to deeply equal ' + format(expected);
  chai.assert.isTrue(deepEql(actual, expected), msg);
};

chai.assert.notDeepEqual = function (actual, expected, msg) {
  msg = msg || 'expected ' + format(actual) + ' to not deeply equal ' + format(expected);
  try {
    assert.notEqual(typeOf(actual), typeOf(expected), msg);
  } catch (e) {
    chai.assert.isFalse(deepEql(actual, expected), msg);
  }
};

chai.assert.ifError = function (value, msg) {
  chai.assert.notOk(value, msg);
  assert.ifError(value, msg);
};

chai.assert.isTrue = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' to be true';
  return chai.assert.strictEqual(value, true, msg);
};

chai.assert.ok = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' to be truthy';
  return chai.assert(value, msg);
};

chai.assert.notOk = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' to be falsy';
  return chai.assert(!value, msg);
};

chai.assert.isFalse = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' to be false';
  return chai.assert.strictEqual(value, false, msg);
};

chai.assert.typeOf = function (value, type, msg) {
  msg = msg || 'expected ' + format(value) + ' to be a ' + type;
  return chai.assert.equal(typeOf(value), type, msg);
};

chai.assert.notTypeOf = function (value, type, msg) {
  msg = msg || 'expected ' + format(value) + ' not to be a ' + type;
  return chai.assert.notEqual(typeOf(value), type, msg);
};

chai.assert.instanceOf = function (value, constructor, msg) {
  msg = msg || 'expected ' + format(value) + ' to be an instance of ' + constructor.name;
  return chai.assert.isTrue(value instanceof constructor, msg);
};

chai.assert.notInstanceOf = function (value, constructor, msg) {
  msg = msg || 'expected ' + format(value) + ' to not be an instance of ' + constructor.name;
  return chai.assert.isFalse(value instanceof constructor, msg);
};

chai.assert.isObject = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' to be an object';
  return chai.assert.typeOf(value, 'object', msg);
};

chai.assert.isNotObject = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' not to be an object';
  return chai.assert.notTypeOf(value, 'object', msg);
};

chai.assert.isNull = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' to equal null';
  return chai.assert.typeOf(value, 'null', msg);
};

chai.assert.isNotNull = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' to not equal null';
  return chai.assert.notTypeOf(value, 'null', msg);
};

chai.assert.isUndefined = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' to equal undefined';
  return chai.assert.typeOf(value, 'undefined', msg);
};

chai.assert.isDefined = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' to not equal undefined';
  return chai.assert.notTypeOf(value, 'undefined', msg);
};

chai.assert.isFunction = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' to be a function';
  return chai.assert.typeOf(value, 'function', msg);
};

chai.assert.isNotFunction = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' not to be a function';
  return chai.assert.notTypeOf(value, 'function', msg);
};

chai.assert.isArray = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' to be an array';
  if (Array.isArray) {
    return chai.assert.isTrue(Array.isArray(value), msg);
  }
  return chai.assert.typeOf(value, 'array', msg);
};

chai.assert.isNotArray = function (value, msg) {
  msg = msg || 'expected ' + format(value) + ' not to be an array';
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

chai.assert.include = function (haystack, needle, msg) {
  var prop;
  msg = msg || 'expected ' + format(haystack) + ' to include ' + format(needle);
  if (typeOf(haystack) === 'object' && typeOf(needle) === 'object') {
    for (prop in needle) {
      if (needle.hasOwnProperty(prop) && haystack.hasOwnProperty(prop)) {
        chai.assert.equal(haystack[prop], needle[prop], msg);
      }
    }
    return;
  }
  if (typeOf(haystack) === 'array') {
    chai.assert.notEqual(indexOf(haystack, needle), -1, msg);
    return;
  }
  if (typeOf(haystack) === 'string') {
    chai.assert.notEqual(haystack.indexOf(needle), -1, msg);
    return;
  }
  chai.assert.fail(true, false, msg);
};

chai.assert.notInclude = function (haystack, needle, msg) {
  var prop;
  msg = msg || 'expected ' + format(haystack) + ' to not include ' + format(needle);
  if (typeOf(haystack) === 'object' && typeOf(needle) === 'object') {
    for (prop in needle) {
      if (needle.hasOwnProperty(prop) && haystack.hasOwnProperty(prop)) {
        chai.assert.notEqual(haystack[prop], needle[prop], msg);
      }
    }
    return;
  }
  if (typeOf(haystack) === 'array') {
    chai.assert.equal(indexOf(haystack, needle), -1, msg);
  }
  if (typeOf(haystack) === 'string') {
    chai.assert.equal(haystack.indexOf(needle), -1, msg);
  }
};

chai.assert.lengthOf = function (obj, length, msg) {
  chai.assert.property(obj, 'length', msg);
  if (obj && typeOf(obj.length) === 'number') {
    msg = msg || 'expected ' + format(obj) + ' to have a length of ' + length + ' but got ' + obj.length;
    chai.assert.equal(obj.length, length, msg);
  }
};

chai.assert.match = function (value, regexp, msg) {
  msg = msg || 'expected ' + format(value) + ' to match ' + regexp;
  chai.assert.instanceOf(regexp, RegExp, msg);
  chai.assert.isTrue(regexp.test(value), msg);
};

chai.assert.notMatch = function (value, regexp, msg) {
  msg = msg || 'expected ' + format(value) + ' not to match ' + regexp;
  chai.assert.instanceOf(regexp, RegExp, msg);
  chai.assert.isFalse(regexp.test(value), msg);
};

chai.assert.property = function (object, property, msg) {
  msg = msg || 'expected ' + format(object) + ' to have a property ' + format(property);
  chai.assert.isDefined(object, msg);
  chai.assert.isString(property, msg);
  chai.assert.isDefined(object[property], msg);
};

chai.assert.notProperty = function (object, property, msg) {
  msg = msg || 'expected ' + format(object) + ' to not have property ' + format(property);
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  chai.assert.isUndefined(object[property], msg);
};

chai.assert.deepProperty = function (object, property, msg) {
  msg = msg || 'expected ' + format(object) + ' to have a deep property ' + format(property);
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  chai.assert.isDefined(pathval.get(object, property), msg);
};

chai.assert.notDeepProperty = function (object, property, msg) {
  msg = msg || 'expected ' + format(object) + ' to not have deep property ' + format(property);
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  chai.assert.isUndefined(pathval.get(object, property), msg);
};

chai.assert.propertyVal = function (object, property, value, msg) {
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  msg = msg || 'expected ' + format(object) + ' to have a property ' + format(property) + ' of ' + format(value) + ', but got ' + format(object[property]);
  chai.assert.isDefined(object[property], msg);
  chai.assert.equal(object[property], value, msg);
};

chai.assert.propertyNotVal = function (object, property, value, msg) {
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  msg = msg || 'expected ' + format(object) + ' to not have a property ' + format(property) + ' of ' + format(value);
  if (typeOf(object[property]) === 'undefined') {
    chai.assert.notProperty(object, property, msg);
    return;
  }
  chai.assert.notEqual(object[property], value, msg);
};

chai.assert.deepPropertyVal = function (object, property, value, msg) {
  var actual;
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  actual = pathval.get(object, property);
  msg = msg || 'expected ' + format(object) + ' to have a deep property ' + format(property) + ' of ' + format(value) + ', but got ' + format(actual);
  return chai.assert.equal(actual, value, msg);
};

chai.assert.deepPropertyNotVal = function (object, property, value, msg) {
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  msg = msg || 'expected ' + format(object) + ' to not have a deep property ' + format(property) + ' of ' + format(value);
  chai.assert.notEqual(pathval.get(object, property), value, msg);
};

chai.assert.operator = function (val1, operator, val2, msg) {
  msg = msg || 'expected ' + format(val1) + ' to be ' + operator + ' ' + format(val2);
  chai.assert.isString(operator);
  switch (operator) {
    case '<':
      chai.assert.isTrue(val1 < val2, msg);
      break;
    case '<=':
      chai.assert.isTrue(val1 <= val2, msg);
      break;
    case '>':
      chai.assert.isTrue(val1 > val2, msg);
      break;
    case '>=':
      chai.assert.isTrue(val1 >= val2, msg);
      break;
    case '==':
      chai.assert.isTrue(val1 === val2, msg);
      break;
    case '!=':
      chai.assert.isTrue(val1 !== val2, msg);
      break;
    case '===':
      chai.assert.isTrue(val1 === val2, msg);
      break;
    case '!==':
      chai.assert.isTrue(val1 !== val2, msg);
      break;
    default:
      throw new Error('Invalid operator "' + operator + '"');
  }
};

chai.assert.closeTo = function (actual, expected, delta, msg) {
  msg = msg || 'expected ' + actual + ' to be close to ' + expected + ' +/- ' + delta;
  chai.assert.isNumber(actual);
  chai.assert.isNumber(expected);
  chai.assert.isNumber(delta);
  return chai.assert.isTrue(Math.abs(actual - expected) <= delta, msg);
};

chai.assert.sameMembers = function (set1, set2, msg) {
  var length;
  msg = msg || 'expected ' + format(set1) + ' to have the same members as ' + format(set2);
  chai.assert.isArray(set1, msg);
  chai.assert.isArray(set2, msg);
  length = set1.length;
  chai.assert.equal(length, set2.length, msg);
  return chai.assert.includeMembers(set1, set2, msg);
};

chai.assert.includeMembers = function (superset, subset, msg) {
  var length;
  msg = msg || 'expected ' + format(superset) + ' to be a superset of ' + format(subset);
  chai.assert.isArray(superset, msg);
  chai.assert.isArray(subset, msg);
  length = subset.length;
  while (length > 0) {
    length -= 1;
    chai.assert.include(superset, subset[length], msg);
  }
};

module.exports = chai;
