(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.chai = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Node.js built-ins

var assert = require("assert");

// this module

var chai, natives, typeOf;

// Array.prototype.indexOf poly-fill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex) {
    var length;
    if (this === undefined || this === null) {
      throw new TypeError("\"this\" is null or not defined");
    }
    length = this.length >>> 0; // Hack to convert object.length to a UInt32
    fromIndex = +fromIndex || 0;
    if (Math.abs(fromIndex) === Infinity) {
      fromIndex = 0;
    }
    if (fromIndex < 0) {
      fromIndex += length;
      if (fromIndex < 0) {
        fromIndex = 0;
      }
    }
    for (; fromIndex < length; fromIndex++) {
      if (this[fromIndex] === searchElement) {
        return fromIndex;
      }
    }
    return -1;
  };
}

// Array.prototype.map poly-fill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

if (!Array.prototype.map) {
  Array.prototype.map = function (fun /*, thisArg */) {
    "use strict";
    if (this === void 0 || this === null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") {
      throw new TypeError();
    }
    var res = new Array(len);
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        res[i] = fun.call(thisArg, t[i], i, t);
      }
    }
    return res;
  };
}

chai = {};

// import Node.JS's assertions

chai.assert = function () {
  return assert.apply(this, arguments);
};

chai.assert.equal = assert.equal;
chai.assert.fail = assert.fail;
chai.assert.throws = assert.throws;

chai.assert.notFail = assert.notFail;
chai.assert.doesNotThrow = assert.doesNotThrow;

// https://github.com/chaijs/chai/blob/master/lib/chai/utils/type.js

natives = {
  "[object Arguments]": "arguments",
  "[object Array]": "array",
  "[object Date]": "date",
  "[object Function]": "function",
  "[object Number]": "number",
  "[object RegExp]": "regexp",
  "[object String]": "string"
};

typeOf = function (obj) {
  var str = Object.prototype.toString.call(obj);
  if (natives[str]) return natives[str];
  if (obj === null) return "null";
  if (obj === undefined) return "undefined";
  if (obj === Object(obj)) return "object";
  return typeof obj;
};

// https://github.com/chaijs/chai/blob/master/lib/chai/utils/getPathValue.js

function _getPathValue(parsed, obj) {
  var tmp = obj,
      res;
  for (var i = 0, l = parsed.length; i < l; i++) {
    var part = parsed[i];
    if (tmp) {
      if ("undefined" !== typeof part.p) tmp = tmp[part.p];else if ("undefined" !== typeof part.i) tmp = tmp[part.i];
      if (i == l - 1) res = tmp;
    } else {
      res = undefined;
    }
  }
  return res;
}

function parsePath(path) {
  var str = path.replace(/\[/g, ".["),
      parts = str.match(/(\\\.|[^.]+?)+/g);
  return parts.map(function (value) {
    var re = /\[(\d+)\]$/,
        mArr = re.exec(value);
    if (mArr) {
      return { i: parseFloat(mArr[1], 10) };
    }
    return { p: value };
  });
}

function getPathValue(path, obj) {
  var parsed = parsePath(path);
  return _getPathValue(parsed, obj);
}

// implement Chai.JS's assertions

function formatAsJSON(value) {
  var type = typeOf(value);
  var json;
  if (type === "array" || type === "object") {
    try {
      json = JSON.stringify(value);
      if (json === "[]" || json === "{}") {
        return json;
      }
      json = json.replace(/([{\[,:])/g, "$1 ");
      json = json.replace(/([}\]])/g, " $1");
      json = json.replace(/"(\w+)":/g, "$1:");
      json = json.replace(/"/g, "'");
      json = json.replace(/\s*$/g, ""); // ES3-friendly trim
      return json;
    } catch (ignore) {
      return "[" + type + "]";
    }
  }
}

function format(value) {
  var type = typeOf(value);
  switch (type) {
    case "array":
      return formatAsJSON(value);
    case "function":
      return value.name ? "[Function: " + value.name + "]" : "[Function]";
    case "object":
      return formatAsJSON(value);
    case "string":
      return "'" + value + "'";
    default:
      return value;
  }
}

chai.assert.notEqual = function (actual, expected, msg) {
  msg = msg || "expected " + format(actual) + " to not equal " + expected;
  assert.notEqual(actual, expected, msg);
};

chai.assert.strictEqual = function (actual, expected, msg) {
  msg = msg || "expected " + format(actual) + " to equal " + expected;
  assert.strictEqual(actual, expected, msg);
};

chai.assert.notStrictEqual = function (actual, expected, msg) {
  msg = msg || "expected " + format(actual) + " to not equal " + expected;
  assert.notStrictEqual(actual, expected, msg);
};

chai.assert.deepEqual = function (actual, expected, msg) {
  if (typeOf(actual) === "regexp" || typeOf(actual) === "date") {
    actual = actual.toString();
  }
  if (typeOf(expected) === "regexp" || typeOf(expected) === "date") {
    expected = expected.toString();
  }
  if (["array", "object"].indexOf(typeOf(actual)) === -1 || ["array", "object"].indexOf(typeOf(expected)) === -1) {
    msg = msg || "expected " + format(actual) + " and " + format(expected) + " to be deeply equal";
    assert.equal(actual, expected, msg);
  }
  msg = msg || "expected " + format(actual) + " to deeply equal " + format(expected);
  assert.deepEqual(actual, expected, msg);
};

chai.assert.notDeepEqual = function (actual, expected, msg) {
  msg = msg || "expected " + format(actual) + " to not deeply equal " + format(expected);
  if (typeOf(actual) === "regexp" || typeOf(actual) === "date") {
    actual = actual.toString();
  }
  if (typeOf(expected) === "regexp" || typeOf(expected) === "date") {
    expected = expected.toString();
  }
  try {
    assert.notEqual(typeOf(actual), typeOf(expected), msg);
  } catch (e) {
    assert.notDeepEqual(actual, expected, msg);
  }
};

chai.assert.ifError = function (value, msg) {
  chai.assert.notOk(value, msg);
  assert.ifError(value, msg);
};

chai.assert.isTrue = function (value, msg) {
  msg = msg || "expected " + format(value) + " to be true";
  return chai.assert.strictEqual(value, true, msg);
};

chai.assert.ok = function (value, msg) {
  msg = msg || "expected " + format(value) + " to be truthy";
  return chai.assert(value, msg);
};

chai.assert.notOk = function (value, msg) {
  msg = msg || "expected " + format(value) + " to be falsy";
  return chai.assert(!value, msg);
};

chai.assert.isFalse = function (value, msg) {
  msg = msg || "expected " + format(value) + " to be false";
  return chai.assert.strictEqual(value, false, msg);
};

chai.assert.typeOf = function (value, type, msg) {
  msg = msg || "expected " + format(value) + " to be a " + type;
  return chai.assert.equal(typeOf(value), type, msg);
};

chai.assert.notTypeOf = function (value, type, msg) {
  msg = msg || "expected " + format(value) + " not to be a " + type;
  return chai.assert.notEqual(typeOf(value), type, msg);
};

chai.assert.instanceOf = function (value, constructor, msg) {
  msg = msg || "expected " + format(value) + " to be an instance of " + constructor.name;
  return chai.assert.isTrue(value instanceof constructor, msg);
};

chai.assert.notInstanceOf = function (value, constructor, msg) {
  msg = msg || "expected " + format(value) + " to not be an instance of " + constructor.name;
  return chai.assert.isFalse(value instanceof constructor, msg);
};

chai.assert.isObject = function (value, msg) {
  msg = msg || "expected " + format(value) + " to be an object";
  return chai.assert.typeOf(value, "object", msg);
};

chai.assert.isNotObject = function (value, msg) {
  msg = msg || "expected " + format(value) + " not to be an object";
  return chai.assert.notTypeOf(value, "object", msg);
};

chai.assert.isNull = function (value, msg) {
  msg = msg || "expected " + format(value) + " to equal null";
  return chai.assert.typeOf(value, "null", msg);
};

chai.assert.isNotNull = function (value, msg) {
  msg = msg || "expected " + format(value) + " to not equal null";
  return chai.assert.notTypeOf(value, "null", msg);
};

chai.assert.isUndefined = function (value, msg) {
  msg = msg || "expected " + format(value) + " to equal undefined";
  return chai.assert.typeOf(value, "undefined", msg);
};

chai.assert.isDefined = function (value, msg) {
  msg = msg || "expected " + format(value) + " to not equal undefined";
  return chai.assert.notTypeOf(value, "undefined", msg);
};

chai.assert.isFunction = function (value, msg) {
  msg = msg || "expected " + format(value) + " to be a function";
  return chai.assert.typeOf(value, "function", msg);
};

chai.assert.isNotFunction = function (value, msg) {
  msg = msg || "expected " + format(value) + " not to be a function";
  return chai.assert.notTypeOf(value, "function", msg);
};

chai.assert.isArray = function (value, msg) {
  msg = msg || "expected " + format(value) + " to be an array";
  if (Array.isArray) {
    return chai.assert.isTrue(Array.isArray(value), msg);
  }
  return chai.assert.typeOf(value, "array", msg);
};

chai.assert.isNotArray = function (value, msg) {
  msg = msg || "expected " + format(value) + " not to be an array";
  if (Array.isArray) {
    return chai.assert.isFalse(Array.isArray(value), msg);
  }
  return chai.assert.notTypeOf(value, "array", msg);
};

chai.assert.isString = function (value, msg) {
  return chai.assert.typeOf(value, "string", msg);
};

chai.assert.isNotString = function (value, msg) {
  return chai.assert.notTypeOf(value, "string", msg);
};

chai.assert.isNumber = function (value, msg) {
  return chai.assert.typeOf(value, "number", msg);
};

chai.assert.isNotNumber = function (value, msg) {
  return chai.assert.notTypeOf(value, "number", msg);
};

chai.assert.isBoolean = function (value, msg) {
  return chai.assert.typeOf(value, "boolean", msg);
};

chai.assert.isNotBoolean = function (value, msg) {
  return chai.assert.notTypeOf(value, "boolean", msg);
};

chai.assert.include = function (haystack, needle, msg) {
  var prop;
  msg = msg || "expected " + format(haystack) + " to include " + format(needle);
  if (typeOf(haystack) === "object" && typeOf(needle) === "object") {
    for (prop in needle) {
      if (needle.hasOwnProperty(prop) && haystack.hasOwnProperty(prop)) {
        chai.assert.equal(haystack[prop], needle[prop], msg);
      }
    }
    return;
  }
  if (typeOf(haystack) === "array" || typeOf(haystack) === "string") {
    chai.assert.notEqual(haystack.indexOf(needle), -1, msg);
    return;
  }
  chai.assert.fail(true, false, msg);
};

chai.assert.notInclude = function (haystack, needle, msg) {
  var prop;
  msg = msg || "expected " + format(haystack) + " to not include " + format(needle);
  if (typeOf(haystack) === "object" && typeOf(needle) === "object") {
    for (prop in needle) {
      if (needle.hasOwnProperty(prop) && haystack.hasOwnProperty(prop)) {
        chai.assert.notEqual(haystack[prop], needle[prop], msg);
      }
    }
    return;
  }
  if (typeOf(haystack) === "array" || typeOf(haystack) === "string") {
    chai.assert.equal(haystack.indexOf(needle), -1, msg);
  }
};

chai.assert.lengthOf = function (obj, length, msg) {
  chai.assert.property(obj, "length", msg);
  if (obj && typeOf(obj.length) === "number") {
    msg = msg || "expected " + format(obj) + " to have a length of " + length + " but got " + obj.length;
    chai.assert.equal(obj.length, length, msg);
  }
};

chai.assert.match = function (value, regexp, msg) {
  msg = msg || "expected " + format(value) + " to match " + regexp;
  chai.assert.instanceOf(regexp, RegExp, msg);
  chai.assert.isTrue(regexp.test(value), msg);
};

chai.assert.notMatch = function (value, regexp, msg) {
  msg = msg || "expected " + format(value) + " not to match " + regexp;
  chai.assert.instanceOf(regexp, RegExp, msg);
  chai.assert.isFalse(regexp.test(value), msg);
};

chai.assert.property = function (object, property, msg) {
  msg = msg || "expected " + format(object) + " to have a property " + format(property);
  chai.assert.isDefined(object, msg);
  chai.assert.isString(property, msg);
  chai.assert.isDefined(object[property], msg);
};

chai.assert.notProperty = function (object, property, msg) {
  msg = msg || "expected " + format(object) + " to not have property " + format(property);
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  chai.assert.isUndefined(object[property], msg);
};

chai.assert.deepProperty = function (object, property, msg) {
  msg = msg || "expected " + format(object) + " to have a deep property " + format(property);
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  chai.assert.isDefined(getPathValue(property, object), msg);
};

chai.assert.notDeepProperty = function (object, property, msg) {
  msg = msg || "expected " + format(object) + " to not have deep property " + format(property);
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  chai.assert.isUndefined(getPathValue(property, object), msg);
};

chai.assert.propertyVal = function (object, property, value, msg) {
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  msg = msg || "expected " + format(object) + " to have a property " + format(property) + " of " + format(value) + ", but got " + format(object[property]);
  chai.assert.isDefined(object[property], msg);
  chai.assert.equal(object[property], value, msg);
};

chai.assert.propertyNotVal = function (object, property, value, msg) {
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  msg = msg || "expected " + format(object) + " to not have a property " + format(property) + " of " + format(value);
  if (typeOf(object[property]) === "undefined") {
    chai.assert.notProperty(object, property, msg);
    return;
  }
  chai.assert.notEqual(object[property], value, msg);
};

chai.assert.deepPropertyVal = function (object, property, value, msg) {
  var actual;
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  actual = getPathValue(property, object);
  msg = msg || "expected " + format(object) + " to have a deep property " + format(property) + " of " + format(value) + ", but got " + format(actual);
  return chai.assert.equal(actual, value, msg);
};

chai.assert.deepPropertyNotVal = function (object, property, value, msg) {
  chai.assert.isDefined(object);
  chai.assert.isString(property);
  msg = msg || "expected " + format(object) + " to not have a deep property " + format(property) + " of " + format(value);
  chai.assert.notEqual(getPathValue(property, object), value, msg);
};

chai.assert.operator = function (val1, operator, val2, msg) {
  msg = msg || "expected " + format(val1) + " to be " + operator + " " + format(val2);
  chai.assert.isString(operator);
  switch (operator) {
    case "<":
      chai.assert.isTrue(val1 < val2, msg);
      break;
    case "<=":
      chai.assert.isTrue(val1 <= val2, msg);
      break;
    case ">":
      chai.assert.isTrue(val1 > val2, msg);
      break;
    case ">=":
      chai.assert.isTrue(val1 >= val2, msg);
      break;
    case "==":
      chai.assert.isTrue(val1 == val2, msg);
      break;
    case "!=":
      chai.assert.isTrue(val1 != val2, msg);
      break;
    case "===":
      chai.assert.isTrue(val1 === val2, msg);
      break;
    case "!==":
      chai.assert.isTrue(val1 !== val2, msg);
      break;
    default:
      throw new Error("Invalid operator \"" + operator + "\"");
  }
};

chai.assert.closeTo = function (actual, expected, delta, msg) {
  msg = msg || "expected " + actual + " to be close to " + expected + " +/- " + delta;
  chai.assert.isNumber(actual);
  chai.assert.isNumber(expected);
  chai.assert.isNumber(delta);
  return chai.assert.isTrue(Math.abs(actual - expected) <= delta, msg);
};

chai.assert.sameMembers = function (set1, set2, msg) {
  var length;
  msg = msg || "expected " + format(set1) + " to have the same members as " + format(set2);
  chai.assert.isArray(set1, msg);
  chai.assert.isArray(set2, msg);
  length = set1.length;
  chai.assert.equal(length, set2.length, msg);
  return chai.assert.includeMembers(set1, set2, msg);
};

chai.assert.includeMembers = function (superset, subset, msg) {
  var length;
  msg = msg || "expected " + format(superset) + " to be a superset of " + format(subset);
  chai.assert.isArray(superset, msg);
  chai.assert.isArray(subset, msg);
  length = subset.length;
  while (length > 0) {
    length -= 1;
    chai.assert.include(superset, subset[length], msg);
  }
};

module.exports = chai;

},{"assert":2}],2:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":6}],3:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],6:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":5,"_process":4,"inherits":3}]},{},[1])(1)
});