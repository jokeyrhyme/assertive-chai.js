'use strict';

// 3rd-party modules

var Backbone = require('backbone');

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

  it('deepEqual for issue #4', function () {
    // https://github.com/jokeyrhyme/assertive-chai.js/issues/4
    err(function () {
      assert.deepEqual(1, 3);
    }, 'expected 1 and 3 to be deeply equal');
  });

  it('notDeepEqual for issue #4', function () {
    // https://github.com/jokeyrhyme/assertive-chai.js/issues/4
    assert.notDeepEqual(1, 3);
  });

  it('ok with a circular object', function () {
    var obj = {};
    obj.a = obj;
    assert.ok(obj);
  });

  it('ok with a circular Backbone.Model', function () {
    var Parent = Backbone.Model.extend({});
    var parent = new Parent();
    var Child = Parent.extend({});
    var child = new Child();
    parent.set('child', child);
    child.set('parent', parent);
    assert.ok(parent);
    assert.ok(child);
  });
});
